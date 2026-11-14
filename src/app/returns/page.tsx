import type { Metadata } from "next";
import { PolicyPage, Strong, Ul } from "@/components/legal/PolicyPage";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Returns & Warranty",
  description: "Our return window, hygiene policy, warranty claims and your rights under the Australian Consumer Law.",
};

const a = "text-champagne underline-offset-4 hover:underline";

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Returns & warranty"
      title={<>If it isn&rsquo;t <em className="text-gold">right</em></>}
      intro={<p>We want every piece to feel worth it. If something isn&rsquo;t right, here is how we&rsquo;ll help, discreetly and without fuss.</p>}
      sections={[
        {
          id: "unopened",
          title: "Change of mind",
          body: (
            <>
              <p>You can return any <Strong>unopened item in its original sealed packaging</Strong> within {legal.returnDays} days of delivery for a full refund of the item price.</p>
              <p>For hygiene reasons, we cannot accept change-of-mind returns on items that have been opened or used. This does not affect your rights if an item is faulty.</p>
            </>
          ),
        },
        {
          id: "faulty",
          title: "Faulty items and warranty",
          body: (
            <>
              <p>If a product is faulty, damaged on arrival or not as described, tell us and we will repair, replace or refund it, as the Australian Consumer Law requires. This applies whether or not the item has been opened.</p>
              <p>Many of our makers also offer a manufacturer&rsquo;s warranty of one to five years. The warranty period for each piece is listed on its product page, and we will handle the claim with the maker for you.</p>
            </>
          ),
        },
        {
          id: "how",
          title: "How to return",
          body: (
            <ol className="list-decimal space-y-2 pl-5 marker:text-champagne/70">
              <li>Email <a href={`mailto:${legal.email}`} className={a}>{legal.email}</a> with your order number and what is wrong.</li>
              <li>We reply within one business day with a pre-paid, neutral return label where one applies.</li>
              <li>Pack the item securely in a plain box and drop it at any post office.</li>
              <li>We refund to your original payment method within five business days of receiving it.</li>
            </ol>
          ),
        },
        {
          id: "acl",
          title: "Your consumer rights",
          body: <p>Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure, and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.</p>,
        },
        {
          id: "exceptions",
          title: "What we can't accept",
          body: (
            <Ul>
              <li>Opened or used items returned for change of mind.</li>
              <li>Lubricants, oils, candles and mists once the seal is broken, unless faulty.</li>
              <li>Damage caused by misuse, such as using silicone lubricant with a silicone piece.</li>
            </Ul>
          ),
        },
      ]}
    />
  );
}
