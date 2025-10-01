import { db } from "./db";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        address TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS stores (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id VARCHAR NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Database tables created successfully");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
}
