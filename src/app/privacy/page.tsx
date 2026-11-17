import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, Strong, Ul } from "@/components/legal/PolicyPage";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Eden Flame collects, protects and uses your personal information, in line with the Australian Privacy Principles.",
};

export default function Page() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title={<>Your privacy, <em className="text-gold">guarded</em></>}
      intro={<p>Discretion is the foundation of Eden Flame. This policy explains what we collect, why, and how we keep it safe, in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.</p>}
      sections={[
        {
          id: "who-we-are",
          title: "Who we are",
          body: (
            <p>
              {legal.brand}{legal.businessName ? ` is operated by ${legal.businessName}` : ""}{legal.abn ? ` (ABN ${legal.abn})` : ""}. We are an online boutique based in {legal.state}, Australia.
              When this policy says &ldquo;we&rdquo; or &ldquo;us&rdquo;, it means {legal.brand}.
            </p>
          ),
        },
        {
          id: "what-we-collect",
          title: "What we collect",
          body: (
            <>
              <p>We collect only what we need to run your order and your account:</p>
              <Ul>
                <li><Strong>Order details:</Strong> your name, delivery address, email, phone number and the items you buy.</li>
                <li><Strong>Account details</Strong> (only if you create an account): your email, a securely hashed password and your discretion preferences.</li>
                <li><Strong>Payment confirmation:</Strong> card payments are handled by Stripe. We never see or store your full card number.</li>
                <li><Strong>Site essentials:</Strong> your age confirmation and bag contents, stored on your own device.</li>
                <li><Strong>Messages</Strong> you send our concierge.</li>
              </Ul>
              <p>You can browse and check out as a guest. We never ask for more than the order needs.</p>
            </>
          ),
        },
        {
          id: "how-we-use-it",
          title: "How we use it",
          body: (
            <Ul>
              <li>To process, pack and deliver your order, and to handle returns and warranty claims.</li>
              <li>To send order emails, always with neutral subject lines and no product images in the preview.</li>
              <li>To keep your account secure and prevent fraud.</li>
              <li>To meet our legal obligations, such as tax record keeping.</li>
              <li>To send news or offers, only if you opt in. Every email has a one-click unsubscribe.</li>
            </Ul>
          ),
        },
        {
          id: "protection",
          title: "How we protect it",
          body: (
            <>
              <p>Your personal details are encrypted in our database, and every page is served over an encrypted connection. Access is limited to the few people who need it to fulfil orders.</p>
              <p>Your bank statement shows only &ldquo;{legal.statementName}&rdquo;, and parcels carry no branding or product names. See <Link href="/discretion" className="text-champagne underline-offset-4 hover:underline">The Discreet Promise</Link>.</p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: (
            <>
              <p>We never sell or rent your information. We share only what each trusted provider needs to do its job:</p>
              <Ul>
                <li><Strong>Stripe</Strong>, to process payments.</li>
                <li><Strong>Our delivery partner</Strong>, who receives your name, address and phone number for the parcel label.</li>
                <li><Strong>Our hosting and email providers</Strong>, who store data on our behalf under strict confidentiality.</li>
              </Ul>
              <p>Some of these providers store data outside Australia, including in the United States. We choose providers with strong security and privacy commitments. We may also disclose information where the law requires it.</p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies and local storage",
          body: (
            <p>We use a small number of essential cookies and on-device storage to remember your age confirmation, your bag and your sign-in. We do not use advertising trackers. If we add analytics in future, we will update this policy first.</p>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          body: (
            <p>We keep order records for as long as Australian tax law requires, usually five years, then delete them. You can close your account at any time from your account page, and we will delete your account details. We keep only what the law requires us to.</p>
          ),
        },
        {
          id: "your-rights",
          title: "Your rights",
          body: (
            <>
              <p>You can ask to see, correct or delete the personal information we hold about you. Email <a href={`mailto:${legal.email}`} className="text-champagne underline-offset-4 hover:underline">{legal.email}</a> and we will reply within 30 days, usually much sooner.</p>
              <p>If you are unhappy with how we handled a privacy matter, tell us first and we will try to put it right. You can also contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" className="text-champagne underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">oaic.gov.au</a>.</p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes to this policy",
          body: <p>We may update this policy as our service grows. The date at the top always shows the latest version, and we will email account holders about any significant change.</p>,
        },
      ]}
    />
  );
}
