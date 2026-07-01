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
  RiSuitcaseLine,
} from "react-icons/ri";
import { SiJira } from "react-icons/si";
import Notifications from "@/components/Notifications";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: RiDashboardLine },
  { label: "Profile", href: "/admin/profile", icon: RiUserLine },
  { label: "Experiences", href: "/admin/experiences", icon: RiBriefcaseLine },
  { label: "Projects", href: "/admin/projects", icon: RiFolderLine },
  { label: "Skills", href: "/admin/skills", icon: RiFlashlightLine },
  { label: "References", href: "/admin/references", icon: RiStarLine },
  { label: "Jira", href: "/admin/jira", icon: "jira" as const },
  { label: "Invoices", href: "/admin/invoices", icon: RiFileTextLine },
  { label: "Jobs", href: "/admin/jobs", icon: RiSuitcaseLine },
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
    <svg className="absolute top-0 -right-[99px] w-[100px] h-full stroke-none fill-dark-500 hidden md:block">
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
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
    // Permanently-dark admin to match the public site. [color-scheme:dark] makes
    // native form controls (inputs/selects/date pickers) render dark, and
    // text-white is the safe default on the dark surface.
    <div className="min-h-screen bg-dark text-white [color-scheme:dark]">
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

      {/* Open button (hamburger) — same bar markup as the public BurgerMenu.
          Hidden while the drawer is open so the drawer overlaps it.
          Mobile: top-right; desktop: top-left. */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="fixed top-4 right-4 md:right-auto md:left-4 z-30 flex size-10 md:size-16 items-center justify-center rounded-full border border-white/20 bg-dark-400 transition-colors duration-300 outline-none hover:bg-dark-600"
        >
          <div
            className={cn(
              "relative w-full",
              "after:block after:h-px after:w-2/5 after:m-auto after:bg-white after:relative after:-top-[5px]",
              "before:block before:h-px before:w-2/5 before:m-auto before:bg-white before:relative before:top-[5px]"
            )}
          />
        </button>
      )}

      {/* Sidebar with Curve - slides from left */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            variants={menuSlide}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed inset-y-0 left-0 z-40 flex h-screen w-full md:w-72 flex-col bg-dark-500 text-white"
          >
            <AdminCurve />

            {/* Close (X) button — inside the drawer so the drawer overlaps the
                open toggle; sits above the drawer content, top-right. */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-dark-600 outline-none"
            >
              <div
                className={cn(
                  "relative w-full",
                  "after:block after:h-px after:w-2/5 after:m-auto after:bg-white after:relative after:rotate-45 after:-top-[1px]",
                  "before:block before:h-px before:w-2/5 before:m-auto before:bg-white before:relative before:-rotate-45 before:top-0"
                )}
              />
            </button>

            {/* Fixed-height column: header/footer pinned, nav scrolls between */}
            <div className="flex h-full flex-col">
              {/* Header — pinned top */}
              <div className="shrink-0 p-6 pt-20 text-center border-b border-white/10 md:pt-6 md:text-left">
                <Link
                  href="/admin"
                  className="text-xs uppercase tracking-widest text-light-100 md:text-lg md:font-bold md:normal-case md:tracking-normal md:text-white"
                >
                  Admin Panel
                </Link>
                <p className="hidden text-xs text-light-100 mt-1 md:block">
                  Portfolio CMS
                </p>
              </div>

              {/* Nav links with stagger animation.
                  Mobile: big, bold, centered items with no icons, vertically
                  centered in the drawer. Desktop (md+): compact icon rows. */}
              <nav className="flex-1 overflow-y-auto">
                <div className="flex min-h-full flex-col justify-center gap-6 py-8 md:block md:min-h-0 md:gap-0 md:py-4">
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
                          "flex items-center justify-center gap-3 px-6 py-3 text-4xl font-bold transition-colors",
                          "md:justify-start md:py-2.5 md:text-sm md:font-normal",
                          isActive
                            ? "text-white md:bg-dark-400 md:font-medium"
                            : "text-light-100 hover:text-white md:hover:bg-dark-400/50"
                        )}
                      >
                        <span className="hidden md:inline-flex">
                          {renderIcon(item)}
                        </span>
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                  })}
                </div>
              </nav>

              {/* Footer — pinned to the bottom, never scrolls over the nav */}
              <div className="shrink-0 border-t border-white/10">
                <div className="p-4">
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
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content — centered horizontally to a max width */}
      <main className="min-h-screen">
        <header className="bg-dark-500 border-b border-dark-600">
          <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-secondary font-pp-acma">
              {title || "Dashboard"}
            </h1>
          </div>
        </header>
        <div className="max-w-6xl mx-auto w-full p-8">{children}</div>
      </main>

      {/* Toast renderer (fixed bottom-right) — shared with the public site */}
      <Notifications />
    </div>
  );
}
