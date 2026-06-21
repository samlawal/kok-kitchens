import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
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

  return true;
}
