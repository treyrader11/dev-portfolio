import { GlobalSearch, GlobalSearchMobile } from "./global-search";

interface AdminHeaderProps {
  title?: string;
  // Suppress the header title entirely (e.g. the event details page renders its
  // own title in the page content instead).
  hideTitle?: boolean;
}

// Full-width admin page header. Rendered by AdminLayout, so every admin page
// gets it automatically. Desktop shows the title on the left and an inline
// search on the right; mobile shows a search icon on the left (opens a modal)
// with the title beside it.
export function AdminHeader({ title, hideTitle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-dark-600 bg-dark-500">
      {/* Inner column shares the same max-width + horizontal padding as the
          main content below, so the title lines up with the form column. */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        {/* Left: mobile search trigger, then the title. */}
        <div className="flex min-w-0 items-center gap-3">
          <GlobalSearchMobile />
          {!hideTitle && (
            <h1 className="truncate text-xl font-bold text-secondary font-pp-acma sm:text-2xl">
              {title || "Dashboard"}
            </h1>
          )}
        </div>
        {/* Right: desktop inline search (hidden on mobile). */}
        <div className="hidden min-w-0 flex-1 justify-end sm:flex">
          <GlobalSearch />
        </div>
      </div>
    </header>
  );
}
