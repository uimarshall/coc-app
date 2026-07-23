import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better-Auth API route handler.
 *
 * This single route handles ALL authentication endpoints:
 *  - POST /api/auth/sign-up/email  — register a new account
 *  - POST /api/auth/sign-in/email  — log in with email + password
 *  - POST /api/auth/sign-out       — log out
 *  - GET  /api/auth/session        — get the current session
 *  - GET  /api/auth/callback/:id   — OAuth callback (if you add social logins)
 *
 * The [...all] in the filename means this route matches any path under /api/auth/
 *
 * @see https://www.better-auth.com/docs/installation#mount-the-handler
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
