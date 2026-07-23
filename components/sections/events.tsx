import { db } from "@/db";
import { events } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { asc } from "drizzle-orm";
import { formatDate, truncate } from "@/lib/utils";

/**
 * Events section — fetches upcoming published events from the database.
 * Only shows events that have not yet passed (date >= today).
 */
export default async function EventsSection() {
  const now = new Date();

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.isPublished, true),
        gte(events.date, now)
      )
    )
    .orderBy(asc(events.date))
    .limit(6)
    .catch(() => []); // Gracefully handle DB unavailability during SSR

  return (
    <section
      id="events"
      className="bg-white py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="events-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Calendar
          </p>
          <h2
            id="events-heading"
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Upcoming Events
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Stay connected — here are the events happening in our church family.
          </p>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-500">
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Date badge */}
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 rounded-lg bg-blue-800 px-2 py-1 text-white">
                    <p className="text-xs font-medium uppercase">
                      {new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
                        new Date(event.date)
                      )}
                    </p>
                    <p className="text-2xl font-bold leading-tight">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <span aria-hidden="true">📍</span>
                      {event.location}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(event.date)}
                  </p>
                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {truncate(event.description, 100)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
