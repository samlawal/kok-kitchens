import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

/**
 * Self-healing schema guard (bug DRBfP9SOiPY): initDb() defines the tables
 * but only runs when /api/init is called — custom_menu_items shipped in code
 * while production's table was never created, so "add new item" 500'd for
 * weeks. Wrap route DB work in this: on Postgres 42P01 (undefined_table) it
 * runs initDb (idempotent CREATE IF NOT EXISTS) and retries once, so a
 * missing table costs one slow request instead of a broken feature.
 * `init` is injectable for tests only.
 */
export async function ensureSchema<T>(op: () => Promise<T>, init: () => Promise<unknown> = initDb): Promise<T> {
  try {
    return await op();
  } catch (e) {
    if ((e as { code?: string })?.code === "42P01") {
      await init();
      return await op();
    }
    throw e;
  }
}

// Initialize the orders table (run once)
export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_type TEXT NOT NULL DEFAULT 'delivery',
      delivery_address TEXT,
      delivery_city TEXT,
      items JSONB NOT NULL,
      subtotal NUMERIC(10,2) NOT NULL,
      delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
      total NUMERIC(10,2) NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Price overrides — admin can update prices without code changes
  await sql`
    CREATE TABLE IF NOT EXISTS price_overrides (
      menu_item_id TEXT PRIMARY KEY,
      price NUMERIC(10,2) NOT NULL,
      updated_by TEXT DEFAULT 'admin',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Name overrides — admin can rename any menu item without a code deploy.
  // (Previously, price/availability/photo were editable but names required a
  // git push — hence the "we thought we fixed this" bug.)
  await sql`
    CREATE TABLE IF NOT EXISTS item_name_overrides (
      menu_item_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      updated_by TEXT DEFAULT 'admin',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Item availability — admin can mark items as unavailable or hidden
  await sql`
    CREATE TABLE IF NOT EXISTS item_availability (
      menu_item_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'available',
      updated_by TEXT DEFAULT 'admin',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Payment tracking on orders (card via Stripe vs pay-on-delivery).
  // Defaults keep existing COD inserts working without code changes.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cod'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT`;

  // Uber Direct courier tracking (extended-zone deliveries). Nullable —
  // only populated when Uber is configured and a courier is dispatched.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_id TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_tracking_url TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ`;

  // Delivery zone (local / extended) captured at checkout — for analytics and
  // (with Uber) routing. Nullable; pickup orders have no zone.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone TEXT`;

  // Equipment-hire stock — how many of each hire item KOK owns. Availability
  // is computed live (total_qty minus overlapping bookings), so this number
  // only changes when the business buys more or writes off damaged/lost stock.
  await sql`
    CREATE TABLE IF NOT EXISTS hire_inventory (
      item_id TEXT PRIMARY KEY,
      total_qty INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Hire bookings — a date-ranged reservation and its lifecycle. Statuses:
  // enquiry (soft hold until hold_expires_at) -> confirmed -> out -> returned
  // -> closed, plus cancelled. Stock is held by enquiry(non-expired)/confirmed/
  // out/returned bookings whose [hire_out_date, return_date] overlaps a request.
  await sql`
    CREATE TABLE IF NOT EXISTS hire_bookings (
      id SERIAL PRIMARY KEY,
      ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      hire_out_date DATE NOT NULL,
      return_date DATE NOT NULL,
      items JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'enquiry',
      notes TEXT,
      hold_expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Lookups when computing availability for a date window.
  await sql`CREATE INDEX IF NOT EXISTS hire_bookings_dates_idx ON hire_bookings (status, hire_out_date, return_date)`;

  // Catering enquiries — persisted (best-effort) for records + future BI.
  // /api/catering-enquiry still emails/pushes the lead even if this write fails.
  await sql`
    CREATE TABLE IF NOT EXISTS catering_enquiries (
      id SERIAL PRIMARY KEY,
      ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      event_date DATE NOT NULL,
      guest_count INTEGER NOT NULL,
      event_type TEXT,
      details TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS catering_enquiries_created_idx ON catering_enquiries (created_at)`;

  // Admin-created menu items — dishes added through the admin panel that don't
  // exist in the static catalogue (lib/menu-data.ts). Stored with full item
  // data so they render identically to code-defined items.
  await sql`
    CREATE TABLE IF NOT EXISTS custom_menu_items (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price NUMERIC(10,2) NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      spicy BOOLEAN NOT NULL DEFAULT FALSE,
      servings TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  return true;
}
