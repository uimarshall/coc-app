import { db } from "@/db";
import { sermons } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatDate, truncate } from "@/lib/utils";

/**
 * Sermons section — fetches the latest published sermons from the database
 * and displays them as a card grid.
 *
 * This is a Server Component (no "use client" directive), so the database
 * query runs on the server and the HTML is sent to the browser ready-made.
 * This is faster and more SEO-friendly than fetching on the client side.
 */
export default async function SermonsSection() {
  // Fetch the 6 most recent published sermons
  const latestSermons = await db
    .select()
    .from(sermons)
    .where(eq(sermons.isPublished, true))
    .orderBy(desc(sermons.date))
    .limit(6)
    .catch(() => []); // Return empty array if DB is unavailable (e.g., during build)

  return (
    <section
      id="sermons"
      className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="sermons-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Messages
          </p>
          <h2
            id="sermons-heading"
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            Recent Sermons
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Catch up on messages you may have missed or revisit a sermon that
            spoke to you.
          </p>
        </div>

        {latestSermons.length === 0 ? (
          // Empty state — shown before any sermons have been uploaded
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-gray-500">
              No sermons available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestSermons.map((sermon) => (
              <article
                key={sermon.id}
                className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="h-48 rounded-t-xl bg-blue-800 flex items-center justify-center">
                  {sermon.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sermon.imageUrl}
                      alt={`Sermon: ${sermon.title}`}
                      className="h-full w-full rounded-t-xl object-cover"
                    />
                  ) : (
                    <span className="text-5xl" aria-hidden="true">
                      🎙️
                    </span>
                  )}
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium text-amber-600">
                    {formatDate(sermon.date)} · {sermon.preacher}
                  </p>
                  <h3 className="mt-2 font-semibold text-gray-900">
                    {sermon.title}
                  </h3>
                  {sermon.scriptureReference && (
                    <p className="mt-1 text-xs text-gray-500 italic">
                      {sermon.scriptureReference}
                    </p>
                  )}
                  {sermon.description && (
                    <p className="mt-2 flex-1 text-sm text-gray-600">
                      {truncate(sermon.description, 120)}
                    </p>
                  )}

                  {/* Media links */}
                  <div className="mt-4 flex gap-3">
                    {sermon.videoUrl && (
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                      >
                        ▶ Watch
                      </a>
                    )}
                    {sermon.audioUrl && (
                      <a
                        href={sermon.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        🎵 Listen
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
