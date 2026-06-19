"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Package, CalendarDays, Check } from "lucide-react";
import { formatPrice } from "@/lib/menu-data";
import { isValidEmail, isValidUkPhone } from "@/lib/validation";
import PageHero from "@/components/PageHero";
import {
  hireItems,
  hireTotal,
  HIRE_CATEGORY_LABELS,
  HIRE_CATEGORY_ORDER,
  type HireSelection,
} from "@/lib/hire-data";

export default function HirePage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hireImages, setHireImages] = useState<Record<string, string>>({});

  // Admin-uploaded hire photos (Vercel Blob), same pattern as the menu.
  useEffect(() => {
    fetch("/api/hire-images")
      .then((r) => r.json())
      .then((d) => d.success && setHireImages(d.images))
      .catch(() => {});
  }, []);
  const [form, setForm] = useState({ name: "", phone: "", email: "", eventDate: "", notes: "" });
  const [errors, setErrors] = useState<{ phone?: boolean; email?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  // Live, date-driven availability for stock-managed items. Empty until a valid
  // event date is chosen; items without an inventory row stay uncapped.
  const [availability, setAvailability] = useState<
    Record<string, { total: number; booked: number; available: number }>
  >({});
  const [availLoading, setAvailLoading] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const eventDate = form.eventDate;
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      setAvailability({});
      return;
    }
    let cancelled = false;
    setAvailLoading(true);
    fetch(`/api/hire-availability?date=${eventDate}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) setAvailability(d.managed || {});
      })
      .catch(() => {
        if (!cancelled) setAvailability({});
      })
      .finally(() => {
        if (!cancelled) setAvailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventDate]);

  // If the chosen date can't supply what's already in the list, trim it down.
  useEffect(() => {
    setQuantities((prev) => {
      let changed = false;
      const copy = { ...prev };
      for (const id of Object.keys(copy)) {
        const a = availability[id];
        if (a && copy[id] > a.available) {
          changed = true;
          if (a.available <= 0) delete copy[id];
          else copy[id] = a.available;
        }
      }
      return changed ? copy : prev;
    });
  }, [availability]);

  const selections: HireSelection[] = useMemo(
    () =>
      hireItems
        .filter((i) => (quantities[i.id] || 0) > 0)
        .map((item) => ({ item, quantity: quantities[item.id] })),
    [quantities]
  );
  const total = hireTotal(selections);

  function setQty(id: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phoneOk = isValidUkPhone(form.phone);
    const emailOk = form.email === "" || isValidEmail(form.email);
    setErrors({ phone: !phoneOk, email: !emailOk });
    if (!form.name || !phoneOk || !emailOk || selections.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/hire-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: selections.map((s) => ({ id: s.item.id, quantity: s.quantity })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmedRef(data.ref);
        setQuantities({});
        setForm({ name: "", phone: "", email: "", eventDate: "", notes: "" });
      } else {
        alert(data.message || "Could not send your enquiry. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappHref = `https://wa.me/447447982712?text=${encodeURIComponent(
    selections.length
      ? `Hi KOK Kitchens! I'd like to hire:\n\n${selections
          .map((s) => `${s.quantity}x ${s.item.name} (${formatPrice(s.item.price * s.quantity)})`)
          .join("\n")}\n\nEstimated: ${formatPrice(total)}`
      : "Hi KOK Kitchens! I'd like to enquire about equipment hire."
  )}`;

  if (confirmedRef) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Enquiry sent!</h1>
          <p className="text-sm text-stone-500 mb-2">Reference <span className="font-semibold text-stone-600">{confirmedRef}</span></p>
          <p className="text-stone-500 leading-relaxed mb-8">
            Thanks — we&apos;ll be in touch shortly to confirm availability, deposit
            and delivery/collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setConfirmedRef(null)}
              className="rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
            >
              New enquiry
            </button>
            <Link href="/" className="rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors">
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <PageHero
        image="/banners/hire-chafing.webp"
        eyebrow="For your event"
        title="Equipment & Tableware Hire"
        subtitle="Chafing dishes, charger plates, cutlery, glassware and coolers — everything to serve your event in style. Build your list and send an enquiry."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Catalogue */}
          <div className="lg:col-span-3 space-y-10">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <label htmlFor="hire-event-date" className="block text-sm font-semibold text-stone-900">
                Your event date
              </label>
              <p className="text-xs text-stone-500 mt-0.5 mb-2">
                Pick a date and we&apos;ll show you what&apos;s available.
              </p>
              <div className="relative max-w-xs">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-stone-500 pointer-events-none" aria-hidden="true" />
                <input
                  id="hire-event-date"
                  type="date"
                  min={today}
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
              {availLoading ? (
                <p className="text-xs text-stone-500 mt-2">Checking availability…</p>
              ) : !eventDate ? (
                <p className="text-xs text-stone-500 mt-2">
                  Choose a date to see live stock and avoid disappointment.
                </p>
              ) : null}
            </div>
            {HIRE_CATEGORY_ORDER.map((cat) => (
              <section key={cat}>
                <h2 className="text-lg font-semibold text-stone-900 mb-4">{HIRE_CATEGORY_LABELS[cat]}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hireItems
                    .filter((i) => i.category === cat)
                    .map((item) => {
                      const qty = quantities[item.id] || 0;
                      const a = availability[item.id];
                      const soldOut = !!a && a.available <= 0;
                      const atMax = !!a && qty >= a.available;
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between gap-3 rounded-xl border bg-white p-4 transition-colors ${
                            qty > 0 ? "border-orange-300" : "border-stone-200"
                          } ${soldOut ? "opacity-70" : ""}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {hireImages[item.id] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={hireImages[item.id]}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                <Package className="h-5 w-5 text-stone-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                              <p className="text-sm text-orange-700 font-semibold">
                                {formatPrice(item.price)}
                                {item.unit && <span className="text-xs text-stone-500 font-normal ml-1">/ {item.unit}</span>}
                              </p>
                              {a && (
                                <p
                                  className={`text-[11px] font-medium mt-0.5 ${
                                    a.available <= 0
                                      ? "text-red-600"
                                      : a.available <= 3
                                        ? "text-amber-700"
                                        : "text-green-700"
                                  }`}
                                >
                                  {a.available <= 0
                                    ? "Fully booked for this date"
                                    : a.available <= 3
                                      ? `Only ${a.available} left`
                                      : `${a.available} available`}
                                </p>
                              )}
                            </div>
                          </div>
                          {soldOut ? (
                            <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500">
                              Fully booked
                            </span>
                          ) : qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => setQty(item.id, 1)}
                              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add
                            </button>
                          ) : (
                            <div className="shrink-0 flex items-center gap-2 rounded-full border border-stone-200 bg-white px-1">
                              <button type="button" onClick={() => setQty(item.id, -1)} aria-label="Decrease" className="flex h-7 w-7 items-center justify-center text-stone-500 hover:text-orange-700">
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold text-stone-900">{qty}</span>
                              <button
                                type="button"
                                onClick={() => setQty(item.id, 1)}
                                disabled={atMax}
                                aria-label="Increase"
                                className={`flex h-7 w-7 items-center justify-center ${
                                  atMax ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:text-orange-700"
                                }`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>

          {/* Hire list + enquiry */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white border border-stone-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-orange-700" />
                <h2 className="text-lg font-semibold text-stone-900">Your hire list</h2>
              </div>

              {selections.length === 0 ? (
                <p className="text-sm text-stone-500 mb-4">
                  Add items from the catalogue to start your enquiry.
                </p>
              ) : (
                <div className="space-y-2 mb-4">
                  {selections.map((s) => (
                    <div key={s.item.id} className="flex justify-between text-sm">
                      <span className="text-stone-600">{s.item.name} ×{s.quantity}</span>
                      <span className="font-medium text-stone-900">{formatPrice(s.item.price * s.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold border-t border-stone-100 pt-3 mt-2">
                    <span className="text-stone-900">Estimated total</span>
                    <span className="text-orange-700">{formatPrice(total)}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Estimate only — we&apos;ll confirm availability, deposit and delivery.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 border-t border-stone-100 pt-4">
                <input
                  type="text" required placeholder="Your name *"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
                <div>
                  <input
                    type="tel" required placeholder="Phone *"
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((p) => ({ ...p, phone: undefined })); }}
                    onBlur={() => setErrors((p) => ({ ...p, phone: form.phone.length > 0 && !isValidUkPhone(form.phone) }))}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-stone-900 focus:ring-2 focus:outline-none ${errors.phone ? "border-red-300 focus:ring-red-100" : "border-stone-200 focus:border-orange-400 focus:ring-orange-100"}`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">Enter a valid UK phone number.</p>}
                </div>
                <div>
                  <input
                    type="email" placeholder="Email (optional)"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((p) => ({ ...p, email: undefined })); }}
                    onBlur={() => setErrors((p) => ({ ...p, email: form.email.length > 0 && !isValidEmail(form.email) }))}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm text-stone-900 focus:ring-2 focus:outline-none ${errors.email ? "border-red-300 focus:ring-red-100" : "border-stone-200 focus:border-orange-400 focus:ring-orange-100"}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>}
                </div>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-stone-500 pointer-events-none" />
                  <input
                    type="date" aria-label="Event date"
                    value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2} placeholder="Notes (delivery area, collection, etc.)"
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
                />
                <button
                  type="submit" disabled={submitting || selections.length === 0}
                  className="w-full rounded-full bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {submitting ? "Sending…" : "Send hire enquiry"}
                </button>
              </form>

              <div className="mt-3 text-center">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-green-700 hover:text-green-700">
                  or enquire on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
