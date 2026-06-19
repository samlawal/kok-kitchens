"use client";

import { useState } from "react";
import { Users, Calendar, Send, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export default function CateringPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "catering", ...data }),
    });

    setSubmitted(true);
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
        eyebrow="Events & celebrations"
        title="Catering Services"
        subtitle="Let us bring authentic Nigerian cuisine to your next event — weddings, birthdays, corporate gatherings, and more. We handle everything from menu planning to on-site setup."
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
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

        <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Request a Quote
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+44..."
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Guests *
                </label>
                <input
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
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Event Type
              </label>
              <select
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
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Menu Preferences & Additional Details
              </label>
              <textarea
                name="details"
                rows={4}
                placeholder="Tell us about your event, preferred dishes, dietary requirements, or any special requests..."
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 active:scale-[0.98] transition-all"
            >
              <Send className="h-4 w-4" />
              Submit Catering Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
