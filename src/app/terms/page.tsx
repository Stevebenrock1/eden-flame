import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, Strong, Ul } from "@/components/legal/PolicyPage";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: "The terms that apply when you browse and buy from Eden Flame.",
};

const a = "text-champagne underline-offset-4 hover:underline";

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title={<>Terms of <em className="text-gold">sale</em></>}
      intro={<p>These terms apply when you use this site or place an order with {legal.brand}. They sit alongside our <Link href="/privacy" className={a}>Privacy Policy</Link>, <Link href="/shipping" className={a}>Shipping</Link> and <Link href="/returns" className={a}>Returns</Link> pages.</p>}
      sections={[
        {
          id: "about",
          title: "About us",
          body: <p>This site is {legal.brand}{legal.businessName ? `, operated by ${legal.businessName}` : ""}{legal.abn ? ` (ABN ${legal.abn})` : ""}, {legal.state}, Australia. You can reach us at <a href={`mailto:${legal.email}`} className={a}>{legal.email}</a>.</p>,
        },
        {
          id: "age",
          title: "Adults only",
          body: <p>Our products are intended for adults. By using this site or placing an order, you confirm that you are 18 or older, or the age of majority where you live. We may cancel any order where we reasonably believe this is not the case.</p>,
        },
        {
          id: "orders",
          title: "Orders and acceptance",
          body: (
            <>
              <p>Your order is an offer to buy. We accept it when we email your order confirmation. We may decline or cancel an order, with a full refund, if:</p>
              <Ul>
                <li>an item is out of stock or no longer available;</li>
                <li>a price or description on the site is clearly wrong; or</li>
                <li>we suspect fraud or a breach of these terms.</li>
              </Ul>
            </>
          ),
        },
        {
          id: "prices",
          title: "Prices and payment",
          body: (
            <>
              <p>Prices are shown in the currency displayed at checkout and include GST where it applies. Delivery charges are shown before you pay.</p>
              <p>Payments are processed securely by Stripe. Your statement will show &ldquo;{legal.statementName}&rdquo;. We never see or store your full card details.</p>
            </>
          ),
        },
        {
          id: "delivery",
          title: "Delivery and ownership",
          body: <p>We deliver within Australia as set out on our <Link href="/shipping" className={a}>Shipping</Link> page. The goods become yours, and the risk passes to you, once they are delivered to the address you gave us.</p>,
        },
        {
          id: "acl",
          title: "Your consumer rights",
          body: (
            <>
              <p>Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure, and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.</p>
              <p>Nothing in these terms limits those rights. Our <Link href="/returns" className={a}>Returns &amp; warranty</Link> page explains how to make a claim.</p>
            </>
          ),
        },
        {
          id: "use",
          title: "Using our products",
          body: <p>Please read and follow the maker&rsquo;s instructions and care guide for every product, including the right lubricant to use. Stop using a product and seek medical advice if you have any discomfort or reaction.</p>,
        },
        {
          id: "site",
          title: "Using this site",
          body: <p>All content on this site, including text, images, film and design, belongs to {legal.brand} or its licensors and may not be copied without permission. Brand names of third-party makers belong to their owners.</p>,
        },
        {
          id: "liability",
          title: "Our liability",
          body: <p>Except for the guarantees under the Australian Consumer Law and any liability that cannot be excluded, we are not liable for indirect or consequential loss arising from your use of this site or our products.</p>,
        },
        {
          id: "law",
          title: "Governing law",
          body: <p>These terms are governed by the laws of {legal.state}, Australia. Both you and we may bring proceedings in the courts of that state.</p>,
        },
        {
          id: "changes",
          title: "Changes to these terms",
          body: <p>We may update these terms from time to time. The terms in place when you place an order apply to that order.</p>,
        },
      ]}
    />
  );
}
