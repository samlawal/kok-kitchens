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

  return true;
}
