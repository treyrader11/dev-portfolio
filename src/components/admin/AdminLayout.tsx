import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect, type ReactNode } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  const sidebarContent = (
    <>
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
                "flex items-center px-6 py-2.5 text-sm transition-colors",
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
          <div className="min-w-0">
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 flex items-center gap-3">
          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1 -ml-1 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {title || "Dashboard"}
          </h1>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
