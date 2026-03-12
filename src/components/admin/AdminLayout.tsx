import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  RiDashboardLine,
  RiUserLine,
  RiBriefcaseLine,
  RiFolderLine,
  RiFlashlightLine,
  RiStarLine,
  RiFileTextLine,
  RiSettings3Line,
  RiExternalLinkLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { SiJira } from "react-icons/si";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: RiDashboardLine },
  { label: "Profile", href: "/admin/profile", icon: RiUserLine },
  { label: "Experiences", href: "/admin/experiences", icon: RiBriefcaseLine },
  { label: "Projects", href: "/admin/projects", icon: RiFolderLine },
  { label: "Skills", href: "/admin/skills", icon: RiFlashlightLine },
  { label: "References", href: "/admin/references", icon: RiStarLine },
  { label: "Jira", href: "/admin/jira", icon: "jira" as const },
  { label: "Invoices", href: "/admin/invoices", icon: RiFileTextLine },
  { label: "Settings", href: "/admin/settings", icon: RiSettings3Line },
];

// Slide from LEFT (mirrored from main site which slides from right)
const menuSlide: Variants = {
  initial: { x: "calc(-100% - 100px)" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: "calc(-100% - 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const linkSlide: Variants = {
  initial: { x: -80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: -80,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

// Curve on the RIGHT edge of the sidebar (since sidebar slides from left)
function AdminCurve() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!height) return null;

  // Path draws down the left edge (x=0), Q curve bows right then straightens
  const initialPath = `M0 0 L0 ${height} Q200 ${height / 2} 0 0`;
  const targetPath = `M0 0 L0 ${height} Q0 ${height / 2} 0 0`;

  const curve: Variants = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg className="absolute top-0 -right-[99px] w-[100px] h-full stroke-none fill-dark-500">
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
}

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

  function renderIcon(item: (typeof navItems)[number]) {
    if (item.icon === "jira") {
      return (
        <SiJira
          className="w-4 h-4 flex-shrink-0"
          style={{ fill: "url(#jira-gradient)" }}
        />
      );
    }
    const Icon = item.icon;
    return <Icon className="w-4 h-4 flex-shrink-0" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SVG gradient definition for Jira icon */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="jira-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2684FF" />
            <stop offset="100%" stopColor="#3860F2" />
          </linearGradient>
        </defs>
      </svg>

      {/* FAB - Animated Hamburger (always visible, top-left) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "fixed top-4 left-4 z-[5] size-16 rounded-full flex items-center justify-center transition-colors duration-300 border-0 outline-none",
          sidebarOpen ? "bg-neutral-800" : "bg-dark"
        )}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <div
          className={cn(
            "relative w-full z-[5]",
            "after:block after:h-px after:w-2/5 after:mx-auto after:bg-white after:relative after:transition-transform after:duration-300",
            "before:block before:h-px before:w-2/5 before:mx-auto before:bg-white before:relative before:transition-transform before:duration-300",
            sidebarOpen
              ? "after:rotate-45 after:-top-[1px] before:-rotate-45 before:top-0"
              : "after:-top-[5px] before:top-[5px]"
          )}
        />
      </button>

      {/* Sidebar with Curve - slides from left */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed inset-y-0 left-0 z-[4] w-64 bg-dark-500 text-white flex flex-col"
          >
            <AdminCurve />

            <div className="h-full flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <Link href="/admin" className="text-lg font-bold">
                  Admin Panel
                </Link>
                <p className="text-xs text-light-100 mt-1">Portfolio CMS</p>
              </div>

              {/* Nav links with stagger animation */}
              <nav className="flex-1 py-4">
                {navItems.map((item, i) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      custom={i}
                      variants={linkSlide}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-dark-400 text-white font-medium"
                            : "text-light-100 hover:text-white hover:bg-dark-400/50"
                        )}
                      >
                        {renderIcon(item)}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* User info + actions */}
              <div className="p-4 border-t border-white/10">
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
                    <p className="text-xs text-light-100 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 text-left text-sm text-light-100 hover:text-white transition-colors"
                >
                  <RiLogoutBoxLine className="w-4 h-4 flex-shrink-0" />
                  Sign out
                </button>
              </div>

              <div className="p-4 border-t border-white/10">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-sm text-light-100 hover:text-white transition-colors"
                >
                  <RiExternalLinkLine className="w-4 h-4 flex-shrink-0" />
                  View site
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="min-h-screen">
        <header className="bg-gray-50 border-b border-gray-200 px-8 py-6 flex justify-end">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || "Dashboard"}
          </h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
