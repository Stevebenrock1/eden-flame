import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, Strong, Ul } from "@/components/legal/PolicyPage";
import { legal } from "@/config/legal";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Discreet Shipping",
  description: "Plain, unbranded packaging, neutral labels and fast tracked delivery across Australia.",
};

const a = "text-champagne underline-offset-4 hover:underline";

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Discreet shipping"
      title={<>Delivered <em className="text-gold">unmarked</em></>}
      intro={<p>Every order leaves us in a plain, sturdy box with no logo and no product names. It arrives quickly, tracked all the way to your door.</p>}
      sections={[
        {
          id: "rates",
          title: "Rates and timing",
          body: (
            <>
              <div className="overflow-hidden border border-ivory/[0.08]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-obsidian-800 text-xs uppercase tracking-[0.18em] text-ivory/50">
                    <tr><th className="px-5 py-4 font-normal">Service</th><th className="px-5 py-4 font-normal">Delivery</th><th className="px-5 py-4 font-normal">Cost</th></tr>
                  </thead>
                  <tbody className="divide-y divide-ivory/[0.06]">
                    <tr><td className="px-5 py-4 text-ivory">Standard, tracked</td><td className="px-5 py-4">{legal.standardDelivery}</td><td className="px-5 py-4">${STANDARD_SHIPPING}, or complimentary over ${FREE_SHIPPING_THRESHOLD}</td></tr>
                    <tr><td className="px-5 py-4 text-ivory">Express, tracked</td><td className="px-5 py-4">{legal.expressDelivery}</td><td className="px-5 py-4">Shown at checkout</td></tr>
                  </tbody>
                </table>
              </div>
              <p>We dispatch orders {legal.dispatch}. Delivery times are estimates from dispatch and can be longer for remote areas.</p>
            </>
          ),
        },
        {
          id: "packaging",
          title: "What arrives at your door",
          body: (
            <Ul>
              <li>A plain outer box with no branding, tape or wording that hints at what is inside.</li>
              <li>The sender shows as &ldquo;{legal.statementName}&rdquo; with a neutral return address.</li>
              <li>No paperwork in the box unless you ask for it. Your receipt arrives by email.</li>
              <li>Inside, each piece is presented in its own gift-ready packaging.</li>
            </Ul>
          ),
        },
        {
          id: "where",
          title: "Where we deliver",
          body: <p>We currently deliver to addresses across Australia, including PO Boxes and parcel lockers for standard delivery. If you would rather not receive your order at home, a parcel locker or post office collection is a private choice.</p>,
        },
        {
          id: "tracking",
          title: "Tracking your order",
          body: <p>Once your order ships, we email a tracking link with a neutral subject line. If you have an account, you can also follow your order from your <Link href="/account" className={a}>account page</Link>.</p>,
        },
        {
          id: "issues",
          title: "If something goes wrong",
          body: (
            <>
              <p>If your parcel is late, lost or arrives damaged, email <a href={`mailto:${legal.email}`} className={a}>{legal.email}</a> with your order number. We will trace it with our carrier and send a replacement or refund where it cannot be found.</p>
              <p><Strong>Please check the address at checkout.</Strong> We cannot redirect a parcel once it has shipped.</p>
            </>
          ),
        },
      ]}
    />
  );
}
