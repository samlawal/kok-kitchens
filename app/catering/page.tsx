"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Calendar, Send, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";

const CATERING_FAQS = [
  {
    q: "How do I book catering for my event?",
    a: "Just fill in the “Request a Quote” form below with your date, guest numbers and event type, and we’ll reply within 24 hours with a tailored quote. Nothing’s confirmed until you’re happy and we’ve agreed the details together.",
  },
  {
    q: "How much does catering cost and how do I pay?",
    a: "Every event is priced bespoke around your menu and guest numbers, so we’ll send you an exact quote within 24 hours. We cater events from 10 guests upwards, with sizes from small (20–50) right up to 200+.",
  },
  {
    q: "Can we customise the menu and mix different dishes?",
    a: "Absolutely — we tailor every menu, so you can mix and match from our 50+ Nigerian dishes like jollof rice, egusi soup and suya. Just tell us what you fancy on the quote form and we’ll plan it with you.",
  },
  {
    q: "Can you cater for allergies, dietary needs and special requests?",
    a: "Absolutely — we’re happy to cater for special requests, including vegetarian, plant-based and other dietary needs. Just flag any allergies or specifics on the quote form and we’ll confirm the details for your event.",
  },
  {
    q: "Which areas do you cover, and do you set up on site?",
    a: "We’re based in Hertfordshire and cater across the county and beyond, handling everything from menu planning to on-site setup on the day. Pop your details into the quote form and we’ll confirm we can reach you.",
  },
  {
    q: "Can I hire tableware and equipment without ordering food?",
    a: "Yes — our equipment and tableware hire is a separate service with live online availability, so you can hire items like chafing dishes and charger plates on their own and hold them for your date. You can also combine hire with catering so it’s all sorted in one go.",
  },
  {
    q: "Is there a delivery charge for food orders?",
    a: "For food orders, local delivery is £4.99 and extended delivery is £7.99 (a live quote may apply for far-out areas), with free collection too. Catering is quoted separately based on your menu and guest numbers.",
  },
];

export default function CateringPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/catering-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      // Only show success on a real 2xx — otherwise the customer thinks the
      // quote request went through when it never reached us.
      if (res.ok && result.success) {
        setSubmitted(true);
      } else {
        setError(
          result.message ||
            "Something went wrong. Please try again or WhatsApp us.",
        );
      }
    } catch {
      setError(
        "Couldn't reach us — please check your connection or WhatsApp us.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-3">
            Request Received!
          </h1>
          <p className="text-stone-500">
            Our catering team will get back to you within 24 hours
            with a custom quote for your event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <PageHero
        image="/banners/catering-buffet.webp"
        eyebrow="Events & celebrations"
        title="Catering Services"
        subtitle="Let us bring authentic Nigerian cuisine to your next event — weddings, birthdays, corporate gatherings, and more. We handle everything from menu planning to on-site setup."
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Small Events",
              range: "20 – 50 guests",
              desc: "Intimate gatherings",
            },
            {
              label: "Medium Events",
              range: "50 – 200 guests",
              desc: "Parties & celebrations",
            },
            {
              label: "Large Events",
              range: "200+ guests",
              desc: "Weddings & corporate",
            },
          ].map((tier) => (
            <div
              key={tier.label}
              className="rounded-2xl bg-white border border-stone-200 p-6 text-center"
            >
              <h3 className="font-semibold text-stone-900">{tier.label}</h3>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                {tier.range}
              </p>
              <p className="text-sm text-stone-500 mt-1">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Event-setting band — carries the warm look of our page banners and
          shows the "we set the table" side of catering, not just the food. */}
      <section className="relative overflow-hidden bg-stone-100">
        <Image
          src="/banners/catering-colour.webp"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Light, airy treatment so the white linen stays crisp while the
            colourful florals still read: a faint warm brand tint plus a soft
            white halo behind the dark text for legibility without washing the
            photo out. */}
        <div className="absolute inset-0 bg-orange-100/15 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_64%_72%_at_50%_50%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.56)_50%,rgba(255,255,255,0)_82%)]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)]">
            We set the table, you enjoy the moment
          </h2>
          <p className="mt-3 text-stone-800 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-semibold drop-shadow-[0_1px_6px_rgba(255,255,255,1)] [text-shadow:0_0_10px_rgba(255,255,255,0.95)]">
            From intimate dinners to 200-guest weddings — we handle the menu,
            the setup and the serving so you can be a guest at your own event.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Request a Quote
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="cat-name"
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cat-phone" className="block text-sm font-medium text-stone-700 mb-1">
                  Phone *
                </label>
                <input
                  id="cat-phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="+44..."
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cat-email" className="block text-sm font-medium text-stone-700 mb-1">
                Email *
              </label>
              <input
                id="cat-email"
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cat-eventDate" className="block text-sm font-medium text-stone-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Event Date *
                </label>
                <input
                  id="cat-eventDate"
                  type="date"
                  name="eventDate"
                  required
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cat-guestCount" className="block text-sm font-medium text-stone-700 mb-1">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Guests *
                </label>
                <input
                  id="cat-guestCount"
                  type="number"
                  name="guestCount"
                  required
                  min="10"
                  placeholder="e.g. 100"
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cat-eventType" className="block text-sm font-medium text-stone-700 mb-1">
                Event Type
              </label>
              <select
                id="cat-eventType"
                name="eventType"
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Party</option>
                <option value="corporate">Corporate Event</option>
                <option value="funeral">Funeral / Memorial</option>
                <option value="naming">Naming Ceremony</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="cat-details" className="block text-sm font-medium text-stone-700 mb-1">
                Menu Preferences & Additional Details
              </label>
              <textarea
                id="cat-details"
                name="details"
                rows={4}
                placeholder="Tell us about your event, preferred dishes, dietary requirements, or any special requests..."
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center font-medium">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending…" : "Submit Catering Request"}
            </button>
          </form>
        </div>

        <FaqAccordion
          items={CATERING_FAQS}
          title="Catering FAQs"
          className="mt-12"
        />
      </div>
    </div>
  );
}
