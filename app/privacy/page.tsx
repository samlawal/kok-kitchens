import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KOK Kitchens collects, uses and protects your personal data when you order food, request catering or hire equipment.",
};

// NOTE FOR KOK / OPHIR: This is a solid starting draft grounded in the
// processors this site actually uses. Please review it (ideally with a legal
// adviser) and complete every [bracketed] item — legal entity, ICO
// registration, trading address and retention periods — before go-live.
const LAST_UPDATED = "June 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-stone-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8 text-stone-700 leading-relaxed">
          <section>
            <p>
              This policy explains how KOK Kitchens (&quot;we&quot;,
              &quot;us&quot;) collects, uses and protects your personal data when
              you use this website to order food, request catering or hire
              equipment. We are committed to handling your information in line
              with the UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Who we are</h2>
            <p>
              KOK Kitchens is the data controller for the personal data
              described here. Our trading name is KOK Kitchens, based in
              Hertfordshire, United Kingdom.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Legal entity: [registered business name / sole trader name]</li>
              <li>Registered / trading address: [business address]</li>
              <li>ICO registration number: [ICO reference, if registered]</li>
              <li>
                Contact:{" "}
                <a href="mailto:orders@kokkitchens.com" className="text-orange-700 font-medium">
                  orders@kokkitchens.com
                </a>{" "}
                · +44 7447 982712
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              What we collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Order &amp; delivery details:</strong> name, email,
                phone, delivery address, postcode and the items you order.
              </li>
              <li>
                <strong>Catering &amp; hire enquiries:</strong> name, contact
                details, event date, guest numbers and the details you choose to
                share about your event.
              </li>
              <li>
                <strong>Payment:</strong> card payments are processed securely by
                Stripe. We do not see or store your full card details.
              </li>
              <li>
                <strong>Communications:</strong> messages you send us by email,
                WhatsApp or our forms.
              </li>
              <li>
                <strong>Technical data:</strong> basic information your browser
                sends (e.g. IP address) needed to serve the site securely.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              How we use it, and our legal basis
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                To take and fulfil your order or booking, and to contact you about
                it — <em>performance of a contract</em>.
              </li>
              <li>
                To respond to catering/hire enquiries and prepare quotes —{" "}
                <em>taking steps at your request before a contract</em>.
              </li>
              <li>
                To send order confirmations and service updates —{" "}
                <em>performance of a contract</em>.
              </li>
              <li>
                To keep records and meet tax/accounting duties —{" "}
                <em>legal obligation</em>.
              </li>
              <li>
                To run and secure the website and improve our service —{" "}
                <em>our legitimate interests</em>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              Who we share it with
            </h2>
            <p>
              We use trusted service providers who process data on our behalf,
              under contract and only for these purposes:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li><strong>Stripe</strong> — secure card payment processing.</li>
              <li><strong>Resend</strong> — sending order/enquiry confirmation emails.</li>
              <li><strong>Neon</strong> — database hosting for orders and bookings.</li>
              <li><strong>Vercel</strong> — website hosting and image storage.</li>
              <li><strong>getAddress.io</strong> — UK address lookup at checkout.</li>
              <li><strong>Uber Direct</strong> — courier delivery, where used for your order.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data. We only disclose it to others
              where the law requires it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">How long we keep it</h2>
            <p>
              We keep order and booking records for as long as needed to provide
              the service and to meet our legal and accounting obligations
              (typically [6] years for financial records). Enquiry messages are
              kept for [a reasonable period] and then deleted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Cookies</h2>
            <p>
              This site uses only the essential cookies needed to make it work
              (for example, keeping your basket during checkout). We do not
              currently use advertising or analytics tracking cookies. If we add
              analytics in future, we will ask for your consent first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Your rights</h2>
            <p>
              You have the right to access, correct, delete or restrict the use
              of your personal data, to object to certain processing, and to data
              portability. To exercise any of these, email{" "}
              <a href="mailto:orders@kokkitchens.com" className="text-orange-700 font-medium">
                orders@kokkitchens.com
              </a>
              . You can also complain to the Information Commissioner&apos;s Office
              (ICO) at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-orange-700 font-medium">
                ico.org.uk
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Changes</h2>
            <p>
              We may update this policy from time to time. The date at the top
              shows when it was last revised. See also our{" "}
              <Link href="/terms" className="text-orange-700 font-medium">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
