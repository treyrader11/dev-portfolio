import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Experiences", href: "/admin/experiences" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "References", href: "/admin/references" },
  { label: "Jira", href: "/admin/jira" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Settings", href: "/admin/settings" },
];

interface Props {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-lg font-bold">
            Admin Panel
          </Link>
          <p className="text-xs text-gray-400 mt-1">Portfolio CMS</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-6 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="truncate">
              <p className="text-sm font-medium truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || "Dashboard"}
          </h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
