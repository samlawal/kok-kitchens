const UBER_CLIENT_ID = process.env.UBER_CLIENT_ID || "";
const UBER_CLIENT_SECRET = process.env.UBER_CLIENT_SECRET || "";
const UBER_CUSTOMER_ID = process.env.UBER_CUSTOMER_ID || "";
// Uber Direct uses the same host for test and live — sandbox vs production is
// selected by the credentials, not the URL. (Kept as one constant to avoid a
// misleading env switch that looks like it changes the endpoint but doesn't.)
const UBER_BASE_URL = "https://api.uber.com/v1/customers";

const PICKUP_ADDRESS = {
  street_address: ["10 Kendals Close"],
  city: "Radlett",
  state: "Hertfordshire",
  zip_code: "WD7 8PQ",
  country: "GB",
};

const PICKUP_NAME = "KOK Kitchens";
const PICKUP_PHONE = "+447447982712";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const res = await fetch("https://login.uber.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: UBER_CLIENT_ID,
      client_secret: UBER_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "eats.deliveries",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Uber auth failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

async function uberFetch(path: string, opts: RequestInit = {}) {
  const token = await getAccessToken();
  const url = `${UBER_BASE_URL}/${UBER_CUSTOMER_ID}${path}`;

  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Uber API ${res.status}: ${err}`);
  }

  return res.json();
}

export interface DeliveryQuote {
  id: string;
  fee: number;
  currency: string;
  estimatedPickupMinutes: number;
  estimatedDeliveryMinutes: number;
  expiresAt: string;
}

export async function getDeliveryQuote(dropoff: {
  address: string;
  city: string;
  postcode: string;
}): Promise<DeliveryQuote> {
  const data = await uberFetch("/delivery_quotes", {
    method: "POST",
    body: JSON.stringify({
      pickup_address: JSON.stringify(PICKUP_ADDRESS),
      dropoff_address: JSON.stringify({
        street_address: [dropoff.address],
        city: dropoff.city,
        state: "Hertfordshire",
        zip_code: dropoff.postcode,
        country: "GB",
      }),
    }),
  });

  return {
    id: data.id,
    fee: data.fee / 100,
    currency: data.currency || "GBP",
    estimatedPickupMinutes: Math.round((data.pickup_duration || 600) / 60),
    estimatedDeliveryMinutes: Math.round((data.dropoff_eta || 1800) / 60),
    expiresAt: data.expires_at || new Date(Date.now() + 300_000).toISOString(),
  };
}

export interface DeliveryRequest {
  quoteId?: string;
  orderRef: string;
  dropoffName: string;
  dropoffPhone: string;
  dropoffAddress: string;
  dropoffCity: string;
  dropoffPostcode: string;
  dropoffNotes?: string;
  items: Array<{ name: string; quantity: number }>;
}

export interface DeliveryResponse {
  deliveryId: string;
  trackingUrl: string;
  status: string;
  estimatedDeliveryMinutes: number;
}

export async function createDelivery(
  req: DeliveryRequest
): Promise<DeliveryResponse> {
  const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/delivery/webhook`
    : undefined;

  const body: Record<string, unknown> = {
    pickup_name: PICKUP_NAME,
    pickup_phone_number: PICKUP_PHONE,
    pickup_address: JSON.stringify(PICKUP_ADDRESS),
    dropoff_name: req.dropoffName,
    dropoff_phone_number: req.dropoffPhone,
    dropoff_address: JSON.stringify({
      street_address: [req.dropoffAddress],
      city: req.dropoffCity,
      state: "Hertfordshire",
      zip_code: req.dropoffPostcode,
      country: "GB",
    }),
    manifest_items: req.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
    })),
    pickup_notes: `Order ${req.orderRef} — KOK Kitchens`,
    dropoff_notes: req.dropoffNotes || undefined,
    external_id: req.orderRef,
  };

  if (req.quoteId) {
    body.quote_id = req.quoteId;
  }

  if (webhookUrl) {
    body.webhook_url = webhookUrl;
  }

  const data = await uberFetch("/deliveries", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    deliveryId: data.id,
    trackingUrl: data.tracking_url || "",
    status: data.status || "pending",
    estimatedDeliveryMinutes: Math.round((data.dropoff_eta || 1800) / 60),
  };
}

export async function getDeliveryStatus(
  deliveryId: string
): Promise<{ status: string; trackingUrl: string }> {
  const data = await uberFetch(`/deliveries/${deliveryId}`, { method: "GET" });
  return {
    status: data.status,
    trackingUrl: data.tracking_url || "",
  };
}

export async function cancelDelivery(
  deliveryId: string
): Promise<{ status: string }> {
  const data = await uberFetch(`/deliveries/${deliveryId}/cancel`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return { status: data.status };
}

export function isUberConfigured(): boolean {
  return !!(UBER_CLIENT_ID && UBER_CLIENT_SECRET && UBER_CUSTOMER_ID);
}
