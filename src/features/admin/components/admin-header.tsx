import { GlobalSearch } from "./global-search";

interface AdminHeaderProps {
  title?: string;
}

// Full-width admin page header. Rendered by AdminLayout, so every admin page
// gets it automatically. Includes the global search on the right.
export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-dark-600 bg-dark-500">
      {/* Inner column shares the same max-width + horizontal padding as the
          main content below, so the title lines up with the form column. */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="shrink-0 text-2xl font-bold text-secondary font-pp-acma">
          {title || "Dashboard"}
        </h1>
        <div className="flex min-w-0 flex-1 justify-end">
          <GlobalSearch />
        </div>
      </div>
    </header>
  );
}
