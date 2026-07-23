import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Database connection module.
 *
 * We use a connection pool so that multiple requests share connections
 * instead of opening a new one for every query (which is very slow).
 *
 * The DATABASE_URL environment variable must be set in your .env file.
 * Format: ******HOST:PORT/DATABASE?sslmode=require
 */

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please add it to your .env file.\n" +
      "Get your connection string from https://neon.tech/"
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  /**
   * SSL is required for Neon (cloud PostgreSQL).
   * In production we disable certificate verification because Neon's
   * certificates are valid but the hostname differs behind a proxy.
   * Never set rejectUnauthorized: false for a database you run yourself.
   */
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },

  // Maximum number of connections kept open in the pool
  max: 10,
});

/**
 * The main Drizzle ORM database instance.
 * Import `db` wherever you need to run a query.
 *
 * @example
 * import { db } from "@/db"
 * import { sermons } from "@/db/schema"
 * const allSermons = await db.select().from(sermons)
 */
export const db = drizzle(pool, { schema });
