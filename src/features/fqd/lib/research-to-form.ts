import { slugify } from "@/lib/utils";
import { withFreeTicketUrl } from "./free-ticket";
import {
  emptyFqdEvent,
  type EventResearch,
  type FqdEventFormValues,
} from "../types/fqd-types";

const pick = (v?: string | null): string => (v && v.trim() ? v.trim() : "");

// Convert an AI-parsed event into the form/create shape (marked "researched").
export function researchToFormValues(f: EventResearch): FqdEventFormValues {
  const title = pick(f.title);
  // Free events with no ticket link get ticketUrl "Free".
  return withFreeTicketUrl({
    ...emptyFqdEvent,
    title,
    slug: slugify(title),
    // Leave as draft — bulk import is AI-sourced and surfaces via the
    // "AI Scraped" chip (derived from rawResearch), not the "researched" status.
    status: "draft",
    startDate: f.startDate ? f.startDate.slice(0, 10) : "",
    endDate: f.endDate ? f.endDate.slice(0, 10) : "",
    startTime: pick(f.startTime),
    locationName: pick(f.locationName),
    address: pick(f.address),
    category: pick(f.category),
    subcategory: pick(f.subcategory),
    description: pick(f.description),
    admission: pick(f.admission),
    ticketUrl: pick(f.ticketUrl),
    organizer: pick(f.organizer),
    expectedAttendance: pick(f.expectedAttendance),
    ageRequirement: pick(f.ageRequirement),
    website: pick(f.website),
    notes: pick(f.notes),
    images: [],
  });
}
