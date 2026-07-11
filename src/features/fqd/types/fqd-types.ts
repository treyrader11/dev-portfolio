import { z } from "zod";
import type { FqdEvent, FqdEventImage } from "@prisma/client";

// ---- Categories ----------------------------------------------------------

// Category → subcategory map used by the event form's dropdowns. Matches what
// frenchquarterdirect.com uses.
export const FQD_CATEGORIES = {
  Festivals: [
    "Music Festival",
    "Food Festival",
    "Cultural Festival",
    "Film Festival",
    "Street Festival",
  ],
  Cultural: ["Parade", "Ceremony", "Holiday Tradition", "Community Event"],
  Cocktails: ["Spirits Conference", "Tasting Event", "Bar Crawl"],
  Cuisine: ["Food Competition", "Culinary Festival", "Restaurant Event"],
  Sports: [
    "NFL Football",
    "PGA Tour",
    "College Football",
    "Action Sports",
    "Road Race",
    "Professional Wrestling",
  ],
  LGBTQ: ["Pride Event", "Parade", "Community Celebration"],
  Family: [
    "Broadway Musical",
    "Broadway Play",
    "Holiday Event",
    "Children's Event",
  ],
  Arts: [
    "Gallery Walk",
    "Film Screening",
    "Literary Festival",
    "Music Concert",
  ],
  "Mardi Gras": ["Krewe Parade", "Ball", "Carnival Event"],
} as const;

export type FqdCategory = keyof typeof FQD_CATEGORIES;

export const FQD_CATEGORY_NAMES = Object.keys(FQD_CATEGORIES) as FqdCategory[];

// ---- Status --------------------------------------------------------------

export const FQD_STATUSES = [
  "draft",
  "researched",
  "approved",
  "exported",
] as const;

export type FqdStatus = (typeof FQD_STATUSES)[number];

// Badge classes, matching the dark admin theme (translucent fill + accent text).
export const FQD_STATUS_BADGE: Record<FqdStatus, string> = {
  draft: "bg-light-400/15 text-light-400",
  researched: "bg-blue-500/15 text-blue-400",
  approved: "bg-success/15 text-success",
  exported: "bg-secondary/15 text-secondary",
};

// ---- AI research / parse schema ------------------------------------------

// Every field is nullish because the model is told to return null for anything
// it can't determine (and may omit fields entirely) — validation stays lenient
// so a partial result still populates the form.
const nullableStr = z.string().trim().nullish();

export const eventResearchSchema = z.object({
  title: nullableStr,
  startDate: nullableStr,
  endDate: nullableStr,
  startTime: nullableStr,
  locationName: nullableStr,
  address: nullableStr,
  description: nullableStr,
  admission: nullableStr,
  website: nullableStr,
  category: nullableStr,
  subcategory: nullableStr,
  ticketUrl: nullableStr,
  organizer: nullableStr,
  expectedAttendance: nullableStr,
  ageRequirement: nullableStr,
  notes: nullableStr,
});

export type EventResearch = z.infer<typeof eventResearchSchema>;

// ---- AI providers (research fallback chain) ------------------------------

export type FqdProvider = "anthropic" | "gemini" | "openai";

// Dot color per provider for the "researched via …" status line.
export const FQD_PROVIDER_DOT: Record<FqdProvider, string> = {
  anthropic: "bg-amber-400",
  gemini: "bg-blue-400",
  openai: "bg-emerald-400",
};

// The successful research/parse response returned by the API routes.
export interface FqdResearchResponse {
  data: EventResearch;
  provider: FqdProvider;
  providerLabel: string;
  searchEngine: string;
  raw: string;
}

// A minimal description of an already-existing event, returned when a create
// would collide with one, so the UI can offer to replace it.
export interface FqdDuplicateInfo {
  id: string;
  title: string;
  slug: string;
  startDate: string; // ISO
}

// ---- Client-side shapes --------------------------------------------------

export interface FqdEventImageInput {
  id?: string;
  url: string;
  cloudinaryId?: string | null;
  alt?: string | null;
  order: number;
}

// The form's controlled state. Dates are ISO date strings (YYYY-MM-DD) so they
// bind straight to <input type="date">; the API converts them to DateTime.
export interface FqdEventFormValues {
  title: string;
  slug: string;
  status: FqdStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  locationName: string;
  address: string;
  category: string;
  subcategory: string;
  description: string;
  admission: string;
  ticketUrl: string;
  organizer: string;
  expectedAttendance: string;
  ageRequirement: string;
  website: string;
  notes: string;
  images: FqdEventImageInput[];
}

export const emptyFqdEvent: FqdEventFormValues = {
  title: "",
  slug: "",
  status: "draft",
  startDate: "",
  endDate: "",
  startTime: "",
  locationName: "",
  address: "",
  category: "",
  subcategory: "",
  description: "",
  admission: "",
  ticketUrl: "",
  organizer: "",
  expectedAttendance: "",
  ageRequirement: "",
  website: "",
  notes: "",
  images: [],
};

// An event row serialized for the client (Dates → ISO strings, images included).
export type FqdEventListItem = Omit<
  FqdEvent,
  "startDate" | "endDate" | "createdAt" | "updatedAt" | "rawResearch"
> & {
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  images: SerializedFqdImage[];
};

export type SerializedFqdImage = Omit<FqdEventImage, "createdAt"> & {
  createdAt: string;
};
