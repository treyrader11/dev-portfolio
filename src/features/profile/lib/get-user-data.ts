import { prisma } from "@/lib/prisma";
import { userData as fallbackUserData } from "@/lib/data";
import type { UserData } from "@/types/data";

// Shipped default avatar when nothing has been uploaded to the CMS.
export const DEFAULT_AVATAR = "/images/portraits/headshot.png";

// The profile lives in SiteConfig (key "userData"), edited in /admin/profile.
// Falls back to the static bundled data if the row/db isn't there.
export async function getUserData(): Promise<UserData> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "userData" },
    });
    // Shallow-merge over the bundled defaults so newly added top-level fields
    // (e.g. `info`) are present even on configs saved before they existed.
    return config
      ? ({ ...fallbackUserData, ...(config.value as object) } as UserData)
      : fallbackUserData;
  } catch {
    return fallbackUserData;
  }
}

// The avatar to actually render: the uploaded one, or the bundled headshot when
// unset (also treats the old "/avatar.png" placeholder as unset).
export function resolveAvatarUrl(user: Pick<UserData, "avatarUrl">): string {
  const url = user.avatarUrl?.trim();
  if (!url || url === "/avatar.png") return DEFAULT_AVATAR;
  return url;
}
