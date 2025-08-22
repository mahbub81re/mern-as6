import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Link href="/admin/users" className="hover:bg-gray-700 px-2 py-1 rounded">Users</Link>
        <Link href="/admin/posts" className="hover:bg-gray-700 px-2 py-1 rounded">Posts</Link>
        <Link href="/admin/comments" className="hover:bg-gray-700 px-2 py-1 rounded">Comments</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
