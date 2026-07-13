import { type ReactNode } from "react";
import { GlobalSearch, GlobalSearchMobile } from "./global-search";

interface AdminHeaderProps {
  title?: string;
  // Suppress the header title entirely (e.g. the event details/list pages render
  // their own title/actions instead).
  hideTitle?: boolean;
  // Page-specific actions rendered on the right of the header.
  actions?: ReactNode;
}

// Full-width admin page header. Rendered by AdminLayout, so every admin page
// gets it automatically. Fixed 80px tall so sticky page toolbars can anchor
// beneath it. Left: mobile search trigger + title. Right: page actions +
// desktop search.
export function AdminHeader({ title, hideTitle, actions }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-20 w-full transform-gpu border-b border-dark-600 bg-dark-500">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: mobile search trigger, then the title. */}
        <div className="flex min-w-0 items-center gap-3">
          <GlobalSearchMobile />
          {!hideTitle && (
            <h1 className="truncate text-xl font-bold text-secondary font-pp-acma sm:text-2xl">
              {title || "Dashboard"}
            </h1>
          )}
        </div>
        {/* Right: page actions + desktop search. */}
        <div className="flex min-w-0 items-center justify-end gap-2">
          {actions}
          <div className="hidden sm:block">
            <GlobalSearch />
          </div>
        </div>
      </div>
    </header>
  );
}
