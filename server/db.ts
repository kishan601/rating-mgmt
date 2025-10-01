import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;
  
  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || '5432';
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${port}/${PGDATABASE}?sslmode=require`;
  }
  
  throw new Error(
    "Database connection not configured. Neither DATABASE_URL nor individual PostgreSQL environment variables are set.",
  );
}

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getPool(): Pool {
  if (!_pool) {
    const connectionString = getDatabaseUrl();
    _pool = new Pool({ connectionString });
  }
  return _pool;
}

export function getDb() {
  if (!_db) {
    _db = drizzle({ client: getPool(), schema });
  }
  return _db;
}

export const pool = getPool();
export const db = getDb();
