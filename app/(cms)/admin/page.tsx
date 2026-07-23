import { db } from "@/db";
import { sermons, events, announcements } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import Link from "next/link";

/**
 * Admin dashboard — overview of the church website's content.
 * Shows counts of published/unpublished items for quick status review.
 */
export default async function AdminDashboard() {
  // Run all count queries in parallel for better performance
  const [
    totalSermons,
    publishedSermons,
    totalEvents,
    publishedEvents,
    totalAnnouncements,
    publishedAnnouncements,
  ] = await Promise.all([
    db.select({ count: count() }).from(sermons),
    db.select({ count: count() }).from(sermons).where(eq(sermons.isPublished, true)),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(events).where(eq(events.isPublished, true)),
    db.select({ count: count() }).from(announcements),
    db.select({ count: count() }).from(announcements).where(eq(announcements.isPublished, true)),
  ]).catch(() =>
    // Return zeros if the DB isn't available yet
    Array(6).fill([{ count: 0 }])
  );

  const stats = [
    {
      label: "Sermons",
      total: totalSermons[0]?.count ?? 0,
      published: publishedSermons[0]?.count ?? 0,
      href: "/admin/sermons",
      icon: "🎙️",
    },
    {
      label: "Events",
      total: totalEvents[0]?.count ?? 0,
      published: publishedEvents[0]?.count ?? 0,
      href: "/admin/events",
      icon: "📅",
    },
    {
      label: "Announcements",
      total: totalAnnouncements[0]?.count ?? 0,
      published: publishedAnnouncements[0]?.count ?? 0,
      href: "/admin/announcements",
      icon: "📣",
    },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-gray-500">
        Welcome to the Church of Christ Huddersfield CMS.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl" aria-hidden="true">
                {stat.icon}
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {stat.published} published
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stat.total}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/sermons", label: "Add New Sermon" },
            { href: "/admin/events", label: "Add New Event" },
            { href: "/admin/announcements", label: "Add Announcement" },
            { href: "/", label: "View Website", external: true },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {action.label}
              {action.external && " ↗"}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
