import Image from "next/image";
import AppStoreBadge from "@/components/AppStoreBadge";
import { cn, resolveImageSrc } from "@/lib/utils";
import type { ProjectData } from "@/types/data";

interface Props {
  // Pass a whole project; the banner reads its icon, title, category, and the
  // Apple App Store link. Reusable for any iOS app in the portfolio.
  project: ProjectData;
  className?: string;
}

// A promotional App Store banner for a project that has an iOS app: the app
// icon + name + category on the left, Apple's "Download on the App Store" badge
// on the right. Renders nothing unless the project has an App Store link, so it
// can be dropped on any project page unconditionally. Modeled on the Mardimix
// app-promotion badge, adapted to an always-visible inline banner (no login /
// dismissal gating, which don't apply to a public project page).
export default function AppStoreBanner({ project, className }: Props) {
  const iosUrl = project.download_links?.ios?.trim();
  if (!iosUrl) return null;

  const icon = project.image?.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {icon && (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-black/5">
          <Image
            src={resolveImageSrc(icon, "/images")}
            alt={`${project.title} app icon`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-dark">{project.title}</p>
        {project.category && (
          <p className="truncate text-sm text-gray-500">{project.category}</p>
        )}
      </div>

      <AppStoreBadge
        href={iosUrl}
        width={140}
        ariaLabel={`Download ${project.title} on the App Store`}
        className="shrink-0"
      />
    </div>
  );
}
