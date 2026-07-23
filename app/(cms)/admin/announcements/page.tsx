import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

/**
 * Admin: Announcements list page.
 */
export default async function AdminAnnouncementsPage() {
  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt))
    .catch(() => []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500">Manage notices and short messages</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Announcement
        </button>
      </div>

      {allAnnouncements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allAnnouncements.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.content}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Created: {formatDate(item.createdAt)}
                </p>
              </div>
              <button
                type="button"
                className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
