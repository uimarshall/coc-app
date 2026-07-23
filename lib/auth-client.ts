"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better-Auth client-side instance.
 *
 * Use this in React components to:
 *  - Check if the user is logged in
 *  - Sign in / sign up / sign out
 *  - Access the current user's session
 *
 * This file is marked "use client" because it uses React hooks internally.
 *
 * @example
 * import { authClient } from "@/lib/auth-client"
 * const { data: session } = authClient.useSession()
 */
export const authClient = createAuthClient({
  /**
   * The base URL of your Next.js app.
   * In the browser this is read from the NEXT_PUBLIC_APP_URL env var.
   * NEXT_PUBLIC_ prefix means Next.js will include this in the browser bundle.
   */
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Named exports for convenience — import only what you need
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
