import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { AuthSession } from "@/lib/auth";
import Link from "next/link";

/**
 * Admin layout — wraps all CMS admin pages.
 *
 * This layout runs on the server and checks the session BEFORE rendering
 * any page content. If the user is not logged in or is not an admin,
 * they are immediately redirected.
 *
 * This is the recommended way to protect pages in Next.js App Router.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current session from Better-Auth using the incoming request headers
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as AuthSession | null;

  // Not logged in → send to sign-in page
  if (!session) {
    redirect("/sign-in");
  }

  // Logged in but not admin → forbidden
  if (session.user.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <aside className="w-64 flex-shrink-0 bg-blue-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-blue-800 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-900 font-bold text-sm">
            C
          </div>
          <span className="font-semibold text-sm">Admin CMS</span>
        </div>

        {/* Nav links */}
        <nav className="mt-4 px-3" aria-label="Admin navigation">
          <ul className="space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: "📊" },
              { href: "/admin/sermons", label: "Sermons", icon: "🎙️" },
              { href: "/admin/events", label: "Events", icon: "📅" },
              { href: "/admin/announcements", label: "Announcements", icon: "📣" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 transition-colors hover:bg-blue-800 hover:text-white"
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: user info + sign-out */}
        <div className="absolute bottom-0 w-64 border-t border-blue-800 px-6 py-4">
          <p className="text-xs font-medium text-blue-300">Signed in as</p>
          <p className="truncate text-sm text-white">{session.user.email}</p>
          <Link
            href="/api/auth/sign-out"
            className="mt-3 block text-xs text-blue-300 hover:text-white transition-colors"
          >
            Sign out →
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
