interface AdminHeaderProps {
  title?: string;
}

// Full-width admin page header. Rendered by AdminLayout, so every admin page
// gets it automatically.
export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-dark-600 bg-dark-500">
      <div className="flex w-full items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold text-secondary font-pp-acma">
          {title || "Dashboard"}
        </h1>
      </div>
    </header>
  );
}
