import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

/**
 * Better-Auth server-side configuration.
 *
 * This object is used in the API route to handle all auth requests
 * (sign-up, sign-in, sign-out, session management, etc.).
 *
 * @see https://www.better-auth.com/docs/installation
 */
export const auth = betterAuth({
  /**
   * Secret key used to sign session tokens.
   * Must be at least 32 characters long.
   * Generate a secure one with: openssl rand -base64 32
   */
  secret: process.env.BETTER_AUTH_SECRET,

  /**
   * The public URL of your application.
   * Used for email verification links, OAuth redirects, etc.
   */
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,

  /**
   * Drizzle adapter — connects Better-Auth to your PostgreSQL database
   * via the Drizzle ORM instance.
   */
  database: drizzleAdapter(db, {
    provider: "pg",
    /**
     * Map Better-Auth's table names to your Drizzle schema objects.
     * The keys must match Better-Auth's expected names exactly.
     */
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  /**
   * Enable email and password authentication.
   * Users can register and log in with an email + password.
   */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    /**
     * Minimum password length for new accounts.
     */
    minPasswordLength: 8,
  },

  /**
   * Session configuration.
   */
  session: {
    // Sessions expire after 7 days of inactivity
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds

    // Extend the session expiry when the user makes a request
    updateAge: 60 * 60 * 24, // update every 24 hours
  },

  /**
   * User configuration — allows us to store extra fields on the user.
   */
  user: {
    additionalFields: {
      /** Custom role field to distinguish admins from regular users. */
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // Not settable during sign-up (prevent privilege escalation)
      },
    },
  },

  /**
   * Trusted origins — requests from these URLs are allowed.
   * Add your production domain here.
   */
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    // Add your production domain, e.g.: "https://yourchurch.com"
  ].filter(Boolean) as string[],
});

// Export the type of the auth instance for use with the client
export type Auth = typeof auth;

/**
 * The shape of a user as returned by auth.api.getSession().
 *
 * We define this explicitly because TypeScript does not always propagate
 * `additionalFields` into the inferred session type automatically.
 * Keeping the type here in one place makes it easy to update.
 */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  /** "user" for regular accounts, "admin" for CMS administrators. */
  role: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/** Full session object returned by auth.api.getSession(). */
export type AuthSession = {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
};
