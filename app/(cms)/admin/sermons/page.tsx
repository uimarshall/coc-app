import { db } from "@/db";
import { sermons } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

/**
 * Admin: Sermons list page.
 * Shows all sermons (published and unpublished) for management.
 *
 * In a full implementation you would add forms to create/edit/delete.
 * For now this is a read-only view to demonstrate the CMS structure.
 */
export default async function AdminSermonsPage() {
  const allSermons = await db
    .select()
    .from(sermons)
    .orderBy(desc(sermons.date))
    .catch(() => []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
          <p className="text-gray-500">Manage sermon recordings and notes</p>
        </div>
        {/* In a real implementation this would open a form/modal */}
        <button
          type="button"
          className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Sermon
        </button>
      </div>

      {allSermons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">No sermons yet. Add your first one!</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Preacher</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allSermons.map((sermon) => (
                <tr key={sermon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {sermon.title}
                    {sermon.scriptureReference && (
                      <span className="ml-2 text-xs text-gray-400">
                        {sermon.scriptureReference}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sermon.preacher}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(sermon.date)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        sermon.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sermon.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
