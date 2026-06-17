import Stripe from "stripe";

// Lazily construct the Stripe client. The Stripe constructor throws on a
// missing key, so we must NOT build it at module load (that would break the
// build's page-data collection before the key is set). Test vs live is chosen
// purely by which secret key is in the env.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
