"""Cut a product off a white or light studio background and place it on the Eden Flame dark gold set
(900x1125, warm espresso glow), matching the other product photos.
usage: python3 restyle-product-photo.py SRC.png OUT.jpg --rotate -30 --fill 0.8 --edge 205
  --mode dark  for dark pieces (black, navy): un-mixes edge pixels so no grey halo is left
  --mode light for light pieces"""
import sys, argparse
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--rotate", type=float, default=0)
ap.add_argument("--fill", type=float, default=0.86, help="share of frame diagonal the product spans")
ap.add_argument("--dark", type=int, default=170, help="product pixels are darker than this (dark products)")
ap.add_argument("--bg", type=int, default=236, help="background is lighter than this")
ap.add_argument("--mode", default="dark", choices=["dark", "light"])
ap.add_argument("--edge", type=float, default=200, help="edge pixels lighter than this become transparent")
ap.add_argument("--glow", type=float, default=1.0)
ap.add_argument("--dy", type=float, default=0.0)
a = ap.parse_args()

im = Image.open(a.src).convert("RGB")
rgb = np.asarray(im).astype(np.float32)
L = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
sat = rgb.max(2) - rgb.min(2)

# 1. background = light, low-saturation pixels connected to the border
cand = ((L > a.bg) & (sat < 18)).astype(np.uint8) * 255
m = Image.fromarray(cand)
h, w = cand.shape
for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
    if m.getpixel(xy) == 255:
        ImageDraw.floodfill(m, xy, 128)
bg = np.asarray(m) == 128

if a.mode == "dark":
    # 2. product core = dark pixels; close small gaps (metal trims, buttons) then fill holes
    core = Image.fromarray(((L < a.dark) & ~bg).astype(np.uint8) * 255)
    core = core.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.MinFilter(11))
else:
    core = Image.fromarray((~bg).astype(np.uint8) * 255).filter(ImageFilter.MinFilter(3))
# hole fill: flood the outside, everything not reached is inside
c = core.copy()
ImageDraw.floodfill(c, (0, 0), 128)
mask = (np.asarray(c) != 128) & ~bg
hard = Image.fromarray(mask.astype(np.uint8) * 255)
if a.mode == "dark":
    # deep inside the silhouette: solid; near the edge: as opaque as the pixel is dark, so the
    # light fringe and floor shadow from the studio shot fall away
    raw = Image.fromarray(((L < a.dark - 30) & ~bg).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    rf = raw.copy(); ImageDraw.floodfill(rf, (0, 0), 128)
    inner = np.asarray(Image.fromarray(((np.asarray(rf) != 128) & ~bg).astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))) > 0
    # edge pixels are a blend of the dark product and the white studio: un-mix them, so they
    # take the product's own colour with partial opacity instead of reading as a grey halo
    body = np.median(rgb[inner & (L < a.dark - 30)], axis=0)
    bodyL = float(body @ np.array([0.299, 0.587, 0.114]))
    soft = np.clip((a.edge - L) / (a.edge - bodyL), 0, 1) ** 1.4
    band = ~inner & (np.asarray(Image.fromarray(mask.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(9))) > 0)
    al = np.where(inner, 1.0, np.where(band, soft, 0.0))
    rgb2 = np.where(band[..., None] & ~inner[..., None], body[None, None, :], rgb)
    im = Image.fromarray(np.clip(rgb2, 0, 255).astype(np.uint8))
    alpha = Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
else:
    alpha = hard.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))

prod = im.convert("RGBA"); prod.putalpha(alpha)
bbox = alpha.getbbox(); prod = prod.crop(bbox)
prod = prod.rotate(a.rotate, resample=Image.BICUBIC, expand=True)
prod = prod.crop(prod.getbbox())

W, H = 900, 1125
diag = (W * W + H * H) ** 0.5
pw, ph = prod.size
s = min(a.fill * diag / (pw * pw + ph * ph) ** 0.5, 0.80 * W / pw, 0.80 * H / ph)
prod = prod.resize((max(1, int(pw * s)), max(1, int(ph * s))), Image.LANCZOS)
pw, ph = prod.size

# 3. the set: warm espresso radial glow, dark vignette (matches the site's other product shots)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
cx, cy = W * 0.5, H * (0.47 + a.dy)
r = np.sqrt(((xx - cx) / (W * 0.62)) ** 2 + ((yy - cy) / (H * 0.55)) ** 2)
t = np.clip(1 - r, 0, 1) ** 1.6
edge = np.array([7, 5, 6], np.float32); mid = np.array([46, 31, 29], np.float32) * a.glow
bgimg = edge + (mid - edge) * t[..., None]
# soft gold haze behind the piece
g = np.exp(-(((xx - cx) / (W * 0.30)) ** 2 + ((yy - cy) / (H * 0.24)) ** 2))
bgimg += np.array([30, 21, 12], np.float32) * g[..., None] * a.glow
canvas = Image.fromarray(np.clip(bgimg + np.random.normal(0, 1.2, bgimg.shape), 0, 255).astype(np.uint8)).convert("RGBA")

ox, oy = int(cx - pw / 2), int(cy - ph / 2)
# contact shadow
sh = Image.new("L", (W, H), 0)
pa = prod.split()[3]
sh.paste(pa.point(lambda v: int(v * 0.75)), (ox + int(pw * 0.02), oy + int(ph * 0.04)))
sh = sh.filter(ImageFilter.GaussianBlur(22))
black = Image.new("RGBA", (W, H), (0, 0, 0, 255)); black.putalpha(sh)
canvas = Image.alpha_composite(canvas, black)
# faint warm rim light so dark pieces separate from the set
if a.mode == "dark":
    rim = pa.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(4))
    rl = Image.new("L", (W, H), 0); rl.paste(rim.point(lambda v: int(v * 0.16)), (ox, oy))
    gold = Image.new("RGBA", (W, H), (190, 150, 95, 255)); gold.putalpha(rl)
    canvas = Image.alpha_composite(canvas, gold)
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); layer.paste(prod, (ox, oy))
canvas = Image.alpha_composite(canvas, layer)
canvas.convert("RGB").save(a.out, quality=90, optimize=True, progressive=True)
print(a.out, prod.size)
