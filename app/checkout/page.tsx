"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, Truck, Info, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";
import {
  zoneFromPostcode,
  fetchPostcode,
  autocompletePostcode,
  type Zone,
} from "@/lib/postcode";
import { isValidEmail, isValidUkPhone } from "@/lib/validation";
import type { AddressSuggestion } from "@/lib/address";

type DeliveryType = "delivery-local" | "delivery-extended" | "pickup";

// Interim flat delivery rates until Uber Direct is live. Once Uber is
// configured, extended switches to live Uber quotes (uberQuote takes precedence
// below); local stays self-delivery. Revisit both rates at Uber activation.
function getDeliveryFee(type: DeliveryType): number {
  if (type === "delivery-local") return 8.99;
  if (type === "delivery-extended") return 13.99;
  return 0;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery-local");
  const [submitting, setSubmitting] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeChecked, setPostcodeChecked] = useState(false);
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const [postcodeArea, setPostcodeArea] = useState<string | null>(null);
  const [postcodeZone, setPostcodeZone] = useState<Zone | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uberQuote, setUberQuote] = useState<{ id: string; fee: number; estimatedMinutes: number } | null>(null);
  const [quotingDelivery, setQuotingDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("card");
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; phone?: boolean }>({});
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [canceled, setCanceled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const deliveryFee = deliveryType === "delivery-extended" && uberQuote
    ? uberQuote.fee
    : getDeliveryFee(deliveryType);
  const grandTotal = totalPrice + deliveryFee;
  const isDelivery = deliveryType !== "pickup";

  const fetchUberQuote = useCallback(async (address: string, city: string, pc: string) => {
    if (!address || !pc) return;
    setQuotingDelivery(true);
    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, city, postcode: pc }),
      });
      const data = await res.json();
      if (data.success && data.quote) {
        setUberQuote(data.quote);
      } else {
        setUberQuote(null);
      }
    } catch {
      setUberQuote(null);
    } finally {
      setQuotingDelivery(false);
    }
  }, []);

  // Fetch full addresses for a postcode (getAddress.io via our proxy). Shows no
  // dropdown if not configured/empty — checkout falls back to manual entry.
  const fetchAddresses = useCallback(async (pc: string) => {
    setAddressSuggestions([]);
    setLoadingAddresses(true);
    try {
      const res = await fetch(`/api/address?postcode=${encodeURIComponent(pc)}`);
      const data = await res.json();
      setAddressSuggestions(data.success ? data.addresses : []);
    } catch {
      setAddressSuggestions([]);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  function selectAddress(a: AddressSuggestion) {
    setForm((prev) => ({ ...prev, address: a.line1, city: a.city || prev.city }));
    setAddressSuggestions([]);
  }

  // Validate a postcode via postcodes.io, then resolve the delivery zone
  // (curated lists win; distance from the kitchen decides unlisted ones).
  const validatePostcode = useCallback(async (value: string) => {
    setLookingUp(true);
    const lookup = await fetchPostcode(value);
    setLookingUp(false);
    setPostcodeChecked(true);
    if (!lookup.valid) {
      setPostcodeValid(false);
      setPostcodeArea(null);
      setPostcodeZone(null);
      setAddressSuggestions([]);
      return;
    }
    setPostcodeValid(true);
    setPostcodeArea(lookup.area ?? null);
    const zone = zoneFromPostcode(value, {
      latitude: lookup.latitude!,
      longitude: lookup.longitude!,
    });
    setPostcodeZone(zone);
    if (zone === "local") setDeliveryType("delivery-local");
    else if (zone === "extended") setDeliveryType("delivery-extended");
    fetchAddresses(value);
  }, [fetchAddresses]);

  function looksComplete(pc: string) {
    return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim());
  }

  function handlePostcodeCheck(value: string) {
    setPostcode(value);
    setUberQuote(null);
    setPostcodeValid(null);
    setPostcodeArea(null);
    setPostcodeZone(null);
    setPostcodeChecked(false);
    setAddressSuggestions([]);

    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    if (value.replace(/\s/g, "").length < 2) {
      setPostcodeSuggestions([]);
      return;
    }
    lookupTimer.current = setTimeout(async () => {
      setPostcodeSuggestions(await autocompletePostcode(value));
      if (looksComplete(value)) validatePostcode(value);
    }, 250);
  }

  function selectSuggestion(pc: string) {
    setPostcode(pc);
    setPostcodeSuggestions([]);
    setUberQuote(null);
    validatePostcode(pc);
  }

  // Address-form postcode field: no dropdown here, just keep state in sync and
  // validate when they finish typing (on blur).
  function handlePostcodeFieldChange(value: string) {
    setPostcode(value);
    setPostcodeSuggestions([]);
    setPostcodeValid(null);
    setPostcodeArea(null);
    setPostcodeZone(null);
    setPostcodeChecked(false);
    setUberQuote(null);
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "email" || field === "phone") {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // Validate email + phone before placing/paying; returns false and flags the
  // bad fields if either is invalid.
  function validateContact(): boolean {
    const emailOk = isValidEmail(form.email);
    const phoneOk = isValidUkPhone(form.phone);
    setFieldErrors({ email: !emailOk, phone: !phoneOk });
    return emailOk && phoneOk;
  }

  // Surface a notice if the customer returned from a cancelled Stripe payment.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("canceled")) {
      setCanceled(true);
    }
  }, []);

  async function handleCardCheckout() {
    if (!validateContact()) return;
    setSubmitting(true);
    try {
      const deliveryZone = deliveryType === "delivery-local" ? "local" : "extended";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { ...form, postcode },
          deliveryType: isDelivery ? "delivery" : "pickup",
          deliveryZone,
          prefillBilling: billingSameAsDelivery,
          subtotal: totalPrice,
          deliveryFee,
          total: grandTotal,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url; // hand off to Stripe-hosted checkout
      } else {
        alert(data.message || "Could not start card payment. Please try again.");
        setSubmitting(false);
      }
    } catch {
      alert("Something went wrong starting payment. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paymentMethod === "card") {
      handleCardCheckout();
      return;
    }
    if (!validateContact()) return;
    setSubmitting(true);

    try {
      const deliveryZone = deliveryType === "delivery-local" ? "local" : "extended";
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { ...form, postcode },
          deliveryType: isDelivery ? "delivery" : "pickup",
          deliveryZone,
          deliveryQuoteId: uberQuote?.id || undefined,
          subtotal: totalPrice,
          deliveryFee,
          total: grandTotal,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      router.push("/checkout/success");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-stone-500 mb-6">
            Add some delicious meals before checking out
          </p>
          <Link
            href="/menu"
            className="inline-flex rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-700 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Method */}
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Delivery Method
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("delivery-local"); setPostcodeChecked(false); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "delivery-local"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <MapPin className={`h-5 w-5 ${deliveryType === "delivery-local" ? "text-orange-700" : "text-stone-500"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Local</p>
                      <p className="text-xs text-stone-500">{formatPrice(8.99)}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("delivery-extended"); setPostcodeChecked(false); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "delivery-extended"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Truck className={`h-5 w-5 ${deliveryType === "delivery-extended" ? "text-orange-700" : "text-stone-500"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Extended</p>
                      <p className="text-xs text-stone-500">{formatPrice(13.99)}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "pickup"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Package className={`h-5 w-5 ${deliveryType === "pickup" ? "text-orange-700" : "text-stone-500"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Pickup</p>
                      <p className="text-xs text-stone-500">Free</p>
                    </div>
                  </button>
                </div>

                {/* Pickup address */}
                {deliveryType === "pickup" && (
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-orange-700 shrink-0 mt-0.5" />
                    <div className="text-sm text-stone-700">
                      <p className="font-medium text-stone-900">Pickup address</p>
                      <p>10 Kendals Close, Radlett</p>
                    </div>
                  </div>
                )}

                {/* Postcode checker for delivery */}
                {isDelivery && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <label htmlFor="co-postcode-check" className="block text-sm font-medium text-stone-700 mb-2">
                      Check your postcode
                    </label>
                    <div className="relative">
                      <input
                        id="co-postcode-check"
                        type="text"
                        value={postcode}
                        onChange={(e) => handlePostcodeCheck(e.target.value)}
                        placeholder="Start typing, e.g. WD7"
                        className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 uppercase focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        maxLength={8}
                        autoComplete="off"
                      />
                      {lookingUp && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-stone-500" />
                      )}
                      {postcodeSuggestions.length > 0 && (
                        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-48 overflow-auto">
                          {postcodeSuggestions.map((pc) => (
                            <li key={pc}>
                              <button
                                type="button"
                                onClick={() => selectSuggestion(pc)}
                                className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-orange-50"
                              >
                                {pc}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {postcodeChecked && postcodeValid === false && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                        <Info className="h-4 w-4 shrink-0" />
                        Not a recognised UK postcode — please check it.
                      </div>
                    )}
                    {postcodeChecked && postcodeValid && postcodeArea && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700">
                        <Check className="h-3.5 w-3.5" />
                        {postcode.toUpperCase()} verified — {postcodeArea}
                      </div>
                    )}
                    {postcodeChecked && postcodeZone === "local" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs">✓</span>
                        Local delivery — {formatPrice(8.99)}
                      </div>
                    )}
                    {postcodeChecked && postcodeZone === "extended" && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-orange-700">
                          <Truck className="h-4 w-4" />
                          Extended delivery — {uberQuote ? formatPrice(uberQuote.fee) : formatPrice(13.99)}
                          {uberQuote && (
                            <span className="text-xs text-stone-500 ml-1">
                              (~{uberQuote.estimatedMinutes} min via courier)
                            </span>
                          )}
                        </div>
                        {!uberQuote && (
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {formatPrice(13.99)} is our standard delivery rate. For a few
                            further-out postcodes it can be a little more — we&apos;ll give you a
                            quick call to agree the delivery charge before we deliver, so
                            there are never any surprises.
                          </p>
                        )}
                        {!uberQuote && form.address && (
                          <button
                            type="button"
                            onClick={() => fetchUberQuote(form.address, form.city, postcode)}
                            disabled={quotingDelivery}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 hover:text-orange-700 disabled:opacity-50"
                          >
                            {quotingDelivery ? (
                              <><Loader2 className="h-3 w-3 animate-spin" /> Getting live quote...</>
                            ) : (
                              "Get live delivery quote"
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {postcodeChecked && postcodeZone === "unknown" && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-stone-500">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          We may not deliver to this area yet.
                          <a href="https://wa.me/447447982712?text=Hi!%20Do%20you%20deliver%20to%20my%20area%3F%20My%20postcode%20is%20" target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium ml-1">
                            WhatsApp us to check →
                          </a>
                        </span>
                      </div>
                    )}
                    {postcodeValid && (loadingAddresses || addressSuggestions.length > 0) && (
                      <div className="mt-3">
                        <label htmlFor="co-address-select" className="block text-xs font-medium text-stone-600 mb-1">
                          {loadingAddresses ? "Finding addresses…" : "Select your address"}
                        </label>
                        {addressSuggestions.length > 0 && (
                          <select
                            id="co-address-select"
                            defaultValue=""
                            onChange={(e) => {
                              const i = Number(e.target.value);
                              if (e.target.value !== "" && !Number.isNaN(i)) selectAddress(addressSuggestions[i]);
                            }}
                            className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                          >
                            <option value="" disabled>
                              {addressSuggestions.length} address{addressSuggestions.length === 1 ? "" : "es"} found — pick yours
                            </option>
                            {addressSuggestions.map((a, i) => (
                              <option key={i} value={i}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-stone-500">
                      <strong>Local:</strong> Borehamwood, Radlett, Bushey, Barnet, Potters Bar
                      <br />
                      <strong>Extended:</strong> Watford, Harrow, North London, St Albans, Hemel
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Your Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="co-name" className="block text-sm font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="co-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="co-email" className="block text-sm font-medium text-stone-700 mb-1">
                        Email *
                      </label>
                      <input
                        id="co-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={() => setFieldErrors((p) => ({ ...p, email: form.email.length > 0 && !isValidEmail(form.email) }))}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-stone-900 focus:ring-2 focus:outline-none ${
                          fieldErrors.email
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-stone-200 focus:border-orange-400 focus:ring-orange-100"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="co-phone" className="block text-sm font-medium text-stone-700 mb-1">
                        Phone *
                      </label>
                      <input
                        id="co-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        onBlur={() => setFieldErrors((p) => ({ ...p, phone: form.phone.length > 0 && !isValidUkPhone(form.phone) }))}
                        placeholder="+44..."
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-stone-900 focus:ring-2 focus:outline-none ${
                          fieldErrors.phone
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-stone-200 focus:border-orange-400 focus:ring-orange-100"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">Enter a valid UK phone number.</p>
                      )}
                    </div>
                  </div>

                  {isDelivery && (
                    <>
                      <div>
                        <label htmlFor="co-address" className="block text-sm font-medium text-stone-700 mb-1">
                          Delivery Address *
                        </label>
                        <input
                          id="co-address"
                          type="text"
                          required
                          value={form.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="co-city" className="block text-sm font-medium text-stone-700 mb-1">
                            City *
                          </label>
                          <input
                            id="co-city"
                            type="text"
                            required
                            value={form.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="e.g. Radlett, Borehamwood"
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label htmlFor="co-postcode" className="block text-sm font-medium text-stone-700 mb-1">
                            Postcode *
                          </label>
                          <input
                            id="co-postcode"
                            type="text"
                            required
                            value={postcode}
                            onChange={(e) => handlePostcodeFieldChange(e.target.value)}
                            onBlur={(e) => {
                              if (looksComplete(e.target.value)) validatePostcode(e.target.value);
                            }}
                            placeholder="e.g. WD7 8PQ"
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 uppercase focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="co-notes" className="block text-sm font-medium text-stone-700 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      id="co-notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any special requests or allergies? (e.g. extra spicy, no onions, nut allergy)"
                      className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white border border-stone-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-stone-600">
                        {item.menuItem.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-stone-900">
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-700">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">
                      Delivery
                      {deliveryType === "delivery-local" && (
                        <span className="text-xs text-stone-500 ml-1">(local)</span>
                      )}
                      {deliveryType === "delivery-extended" && (
                        <span className="text-xs text-stone-500 ml-1">
                          ({uberQuote ? "Uber courier" : "extended"})
                        </span>
                      )}
                    </span>
                    <span className="text-stone-700">
                      {deliveryFee === 0
                        ? "Free"
                        : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {uberQuote && deliveryType === "delivery-extended" && (
                    <div className="text-xs text-stone-500">
                      Est. {uberQuote.estimatedMinutes} min delivery via courier
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold border-t border-stone-100 pt-3">
                    <span className="text-stone-900">Total</span>
                    <span className="text-orange-700">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="mt-5">
                  <p className="text-xs font-medium text-stone-500 mb-2">Payment</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        paymentMethod === "cod"
                          ? "border-orange-500 bg-orange-50 text-stone-900"
                          : "border-stone-200 text-stone-500 hover:border-stone-300"
                      }`}
                    >
                      Pay on delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                        paymentMethod === "card"
                          ? "border-orange-500 bg-orange-50 text-stone-900"
                          : "border-stone-200 text-stone-500 hover:border-stone-300"
                      }`}
                    >
                      Pay by card
                    </button>
                  </div>
                  {paymentMethod === "card" && isDelivery && (
                    <label className="mt-3 flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingSameAsDelivery}
                        onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-stone-300 text-orange-700 focus:ring-orange-400"
                      />
                      <span className="text-xs text-stone-500 leading-relaxed">
                        Billing address same as delivery — we&apos;ll pre-fill it on the
                        secure payment page. Untick to enter a different one there.
                      </span>
                    </label>
                  )}
                </div>

                {canceled && (
                  <p className="mt-4 text-sm text-amber-600 text-center font-medium">
                    Payment cancelled — your order wasn&apos;t placed. You can try again.
                  </p>
                )}

                {totalPrice < 20 && (
                  <p className="mt-6 text-sm text-red-600 text-center font-medium">
                    Minimum order amount is {formatPrice(20)}. Please add {formatPrice(20 - totalPrice)} more to proceed.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || totalPrice < 20}
                  className="mt-4 w-full rounded-full bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {submitting
                    ? paymentMethod === "card"
                      ? "Redirecting to payment…"
                      : "Placing Order…"
                    : paymentMethod === "card"
                      ? "Pay by Card"
                      : "Place Order"}
                </button>

                <p className="mt-3 text-xs text-stone-500 text-center">
                  {paymentMethod === "card"
                    ? "You'll be redirected to secure Stripe checkout. A confirmation email follows."
                    : "Payment on delivery. You'll receive an order confirmation via email."}
                </p>
                <p className="mt-2 text-xs text-stone-500 text-center">
                  By placing your order you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-orange-700">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-orange-700">
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* WhatsApp checkout alternative */}
                <div className="mt-4 pt-4 border-t border-stone-100 text-center">
                  <p className="text-xs text-stone-500 mb-2">
                    Prefer to order via chat?
                  </p>
                  <a
                    href={`https://wa.me/447447982712?text=${encodeURIComponent(
                      `Hi KOK Kitchens! I'd like to order:\n\n${items
                        .map(
                          (i) =>
                            `${i.quantity}x ${i.menuItem.name} (${formatPrice(i.menuItem.price * i.quantity)})`
                        )
                        .join("\n")}\n\nSubtotal: ${formatPrice(totalPrice)}${deliveryFee > 0 ? `\nDelivery: ${formatPrice(deliveryFee)}` : ""}\nTotal: ${formatPrice(grandTotal)}\n\nDelivery type: ${deliveryType === "pickup" ? "Pickup" : "Delivery"}${postcode ? `\nPostcode: ${postcode}` : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-green-600 px-5 py-2.5 text-sm font-medium text-green-700 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order via WhatsApp
                  </a>
                  <p className="mt-2 text-[11px] text-stone-500 leading-relaxed">
                    Opens WhatsApp to place your order by chat — we&apos;ll confirm it
                    there. Your basket stays saved if you&apos;d rather pay online above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
