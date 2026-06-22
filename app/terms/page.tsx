import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you order food, book catering or hire equipment from KOK Kitchens.",
};

// NOTE FOR KOK / OPHIR: Starting draft covering food orders, catering and
// equipment hire. Please review (ideally with a legal adviser) and complete
// every [bracketed] item — legal entity, deposit/cancellation terms and hire
// damage terms — before go-live.
const LAST_UPDATED = "June 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-stone-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8 text-stone-700 leading-relaxed">
          <section>
            <p>
              These terms apply when you order food, book catering or hire
              equipment from KOK Kitchens (&quot;we&quot;, &quot;us&quot;).
              Please read them before placing an order. By placing an order you
              agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Who we are</h2>
            <p>
              KOK Kitchens, based in Hertfordshire, United Kingdom. Legal entity:
              [registered business name / sole trader name], [business address].
              Contact:{" "}
              <a href="mailto:orders@kokkitchens.com" className="text-orange-700 font-medium">
                orders@kokkitchens.com
              </a>{" "}
              · +44 7447 982712.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Food orders</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Prices are shown on the menu in GBP. Delivery is charged at
                checkout: local delivery £8.99 and extended delivery £13.99 (a live
                quote may apply for areas further out). Collection is free.
              </li>
              <li>
                You can pay securely by card (via Stripe) or pay on delivery,
                where offered. Your order is confirmed once you receive our
                confirmation.
              </li>
              <li>
                We deliver across North London &amp; Hertfordshire and nearby
                areas. We&apos;ll let
                you know if we can&apos;t reach your address.
              </li>
              <li>
                Because our food is freshly prepared and perishable, orders
                generally cannot be cancelled or refunded once preparation has
                begun. If something is wrong with your order, contact us straight
                away and we&apos;ll put it right.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              Allergens &amp; dietary requirements
            </h2>
            <p>
              Our dishes are prepared in a kitchen that handles common allergens.
              If you have an allergy or dietary requirement, please tell us before
              ordering and we will confirm what we can safely provide. We cannot
              guarantee the absence of any allergen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Catering</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Catering is quoted individually based on your menu and guest
                numbers. A booking is confirmed once you accept the quote and any
                deposit is paid.
              </li>
              <li>
                Deposit: a 25% deposit secures your date. The balance is due 7
                days before your event.
              </li>
              <li>
                Cancellation: cancel 14 or more days before your event for a
                refund of everything except the deposit. Within 14 days, the full
                amount may be charged, as we order and prepare food to your guest
                numbers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              Equipment &amp; tableware hire
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Items can be reserved subject to availability for your event
                dates. A reservation is held while we confirm the details with
                you.
              </li>
              <li>
                Hire covers your event window (typically 1–3 days). A refundable
                security deposit may be required, returned once the items come
                back in good order.
              </li>
              <li>
                You are responsible for hired items while in your care. Items must
                be returned by the agreed date in the condition supplied. Loss or
                damage is charged at full replacement cost, and late returns are
                charged at the daily hire rate for each extra day.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              Our liability
            </h2>
            <p>
              Nothing in these terms limits your statutory rights as a consumer,
              or our liability for death or personal injury caused by negligence,
              or for fraud. Otherwise, our liability in connection with an order
              is limited to the value of that order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Complaints</h2>
            <p>
              If you&apos;re not happy with anything, please contact us at{" "}
              <a href="mailto:orders@kokkitchens.com" className="text-orange-700 font-medium">
                orders@kokkitchens.com
              </a>{" "}
              and we&apos;ll do our best to resolve it quickly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Governing law</h2>
            <p>
              These terms are governed by the law of England and Wales. See also
              our{" "}
              <Link href="/privacy" className="text-orange-700 font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
