import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 * This controls how drizzle-kit generates and runs migrations.
 * @see https://orm.drizzle.team/docs/kit-overview
 */
export default defineConfig({
  // The location of your Drizzle ORM schema file
  schema: "./db/schema.ts",

  // The folder where migration SQL files will be saved
  out: "./db/migrations",

  // The database type — "pg" means PostgreSQL
  dialect: "postgresql",

  dbCredentials: {
    // Reads the DATABASE_URL from your .env file
    url: process.env.DATABASE_URL!,
  },

  // Print SQL statements when running migrations (helpful for debugging)
  verbose: true,

  // Ask for confirmation before running destructive operations
  strict: true,
});
