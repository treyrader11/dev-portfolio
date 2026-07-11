import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, type ReactNode } from "react";
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
  RiCalendarEventLine,
} from "react-icons/ri";
import { SiJira } from "react-icons/si";
import Notifications from "@/components/Notifications";
import { AdminHeader } from "./admin-header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ViewSiteFab from "./view-site-fab";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: RiDashboardLine },
  { label: "Profile", href: "/admin/profile", icon: RiUserLine },
  { label: "Experience", href: "/admin/experience", icon: RiBriefcaseLine },
  { label: "Projects", href: "/admin/projects", icon: RiFolderLine },
  { label: "Skills", href: "/admin/skills", icon: RiFlashlightLine },
  { label: "References", href: "/admin/references", icon: RiStarLine },
  { label: "Jira", href: "/admin/jira", icon: "jira" as const },
  { label: "Invoices", href: "/admin/invoices", icon: RiFileTextLine },
  { label: "Jobs", href: "/admin/jobs", icon: RiSuitcaseLine },
  {
    label: "French Quarter Direct",
    href: "/admin/french-quarter-direct",
    icon: RiCalendarEventLine,
  },
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
    <svg
      className={cn(
        "absolute",
        "top-0",
        "-right-[99px]",
        "w-[100px]",
        "h-full",
        "stroke-none",
        "fill-dark-500",
        "hidden",
        "md:block",
      )}
    >
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
  className?: string;
  // Override the auto-generated breadcrumbs (e.g. for nested detail routes
  // that aren't in navItems, like /admin/experience/[slug]).
  breadcrumbs?: { label: string; href?: string }[];
}

export default function AdminLayout({
  children,
  title,
  className,
  breadcrumbs,
}: AdminLayoutProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  // Close the sidebar when clicking outside it (ignoring the toggle button,
  // which manages its own open/close).
  useEffect(() => {
    if (!sidebarOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !sidebarRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [sidebarOpen]);

  function renderIcon(item: (typeof navItems)[number]) {
    if (item.icon === "jira") {
      return (
        <SiJira
          className="size-4 flex-shrink-0"
          style={{ fill: "url(#jira-gradient)" }}
        />
      );
    }
    const Icon = item.icon;
    return <Icon className="size-4 flex-shrink-0" />;
  }

  const currentNav = navItems.find((n) => n.href === router.pathname);
  const autoCrumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/admin" },
  ];
  if (currentNav && currentNav.href !== "/admin") {
    autoCrumbs.push({ label: currentNav.label, href: currentNav.href });
  }
  const crumbs = breadcrumbs ?? autoCrumbs;

  return (
    // Permanently-dark admin to match the public site. [color-scheme:dark] makes
    // native form controls (inputs/selects/date pickers) render dark, and
    // text-white is the safe default on the dark surface.
    <div
      className={cn(
        "min-h-screen",
        "bg-dark",
        "text-white",
        "[color-scheme:dark]",
        className,
      )}
    >
      {/* Main content — centered horizontally to a max width */}
      <main className="min-h-screen">
        <AdminHeader title={title} />
        {/* Single shared content column. Every admin page's content and the
            header above align to the same max-width + horizontal padding, so
            pages never need their own max-w-* overrides. */}
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} className="mb-6" />
          {children}
        </div>
      </main>

      <div className={cn("max-w-5xl", "mx-auto", "w-full", "px-4")}>
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

        {/* Toggle — identical markup to the public BurgerMenu (circle + bars that
          fold into an X). Stays on top of the drawer so it also closes it.
          Mobile: top-right; desktop: top-left. */}
        <button
          ref={toggleRef}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          className={cn(
            "fixed",
            "top-5",
            "right-5",
            "z-50",
            "flex",
            "size-16",
            "items-center",
            "justify-center",
            "rounded-full",
            "border",
            "border-white/20",
            "outline-none",
            "transition-colors",
            "duration-300",
            sidebarOpen ? "bg-neutral-800" : "bg-dark",
          )}
        >
          <div
            className={cn(
              "relative",
              "w-full",
              "after:block",
              "after:h-px",
              "after:w-2/5",
              "after:m-auto",
              "after:bg-white",
              "after:relative",
              "after:transition-transform",
              "after:duration-300",
              "before:block",
              "before:h-px",
              "before:w-2/5",
              "before:m-auto",
              "before:bg-white",
              "before:relative",
              "before:transition-transform",
              "before:duration-300",
              sidebarOpen
                ? "after:rotate-45 after:-top-[1px] before:-rotate-45 before:top-0"
                : "after:-top-[5px] before:top-[5px]",
            )}
          />
        </button>

        {/* Sidebar with Curve - slides from left */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              ref={sidebarRef}
              variants={menuSlide}
              initial="initial"
              animate="enter"
              exit="exit"
              className={cn(
                "fixed inset-x-0 inset-y-0 z-40 flex h-screen flex-col bg-dark-500 text-white md:inset-x-auto md:left-0 md:w-80",
              )}
            >
              <AdminCurve />

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
              <nav className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex min-h-full flex-col justify-center gap-1 py-8 md:block md:min-h-0 md:gap-0 md:py-4">
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
                            "flex",
                            "items-center",
                            "justify-start",
                            "gap-3",
                            "px-6",
                            "py-1.5",
                            "text-4xl",
                            "font-bold",
                            "transition-colors",
                            "md:py-1.5",
                            "md:text-sm",
                            "md:font-normal",
                            isActive
                              ? "text-white md:bg-dark-400 md:font-medium"
                              : "text-light-100 hover:text-white md:hover:bg-dark-400/50",
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
                <div className="p-4 flex items-center gap-3">
                  {session?.user?.image && (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-light-100 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex flex-shrink-0 items-center gap-1.5 text-sm text-light-100 hover:text-white transition-colors"
                    aria-label="Sign out"
                  >
                    <RiLogoutBoxLine className="size-4 flex-shrink-0" />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toast renderer (fixed bottom-right) — shared with the public site */}
        <ViewSiteFab />
        <Notifications />
      </div>
    </div>
  );
}
