import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path
import { LogOut, PenSquare, LayoutDashboard, UserPlus, LogIn, Shield } from "lucide-react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80 transition">
          MyBlog
        </Link>

        {/* Right side links */}
        <div className="flex items-center gap-5 text-gray-700 font-medium">
          {!user && (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/user/editor"
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <PenSquare className="w-4 h-4" /> Write
              </Link>
              <Link
                href="/user"
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 hover:text-blue-600 transition"
                >
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </form>
            </>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-6">{children}</main>
    </>
  );
}
