import { Chip, type ChipVariant } from "@/components/ui/chip";
import { type FqdEventListItem, type FqdStatus } from "../types/fqd-types";

// The manual workflow statuses that warrant their own chip. "draft" is the
// default and shows nothing on its own (a fallback "Draft" chip covers the
// empty case). "researched" reads as manual research, since AI no longer
// auto-sets it — AI populates surface via the separate "AI Scraped" chip.
const WORKFLOW_CHIP: Partial<
  Record<FqdStatus, { label: string; variant: ChipVariant }>
> = {
  researched: { label: "Researched", variant: "amber" },
  approved: { label: "Approved", variant: "success" },
  exported: { label: "Exported", variant: "secondary" },
};

// Chips describing an event's provenance + workflow state. Shows an "AI Scraped"
// chip when AI populated it, plus the manual status when set — so an event that
// was AI scraped AND manually researched shows both.
export function EventStatusChips({
  event,
  chipClassName,
}: {
  event: FqdEventListItem;
  chipClassName?: string;
}) {
  const status = event.status as FqdStatus;
  const workflow = WORKFLOW_CHIP[status];
  const chips: { key: string; label: string; variant: ChipVariant }[] = [];
  if (event.isNew) chips.push({ key: "new", label: "New", variant: "success" });
  if (workflow) chips.push({ key: "status", ...workflow });
  if (event.aiScraped)
    chips.push({ key: "ai", label: "AI Scraped", variant: "info" });
  if (chips.length === 0)
    chips.push({ key: "draft", label: "Draft", variant: "neutral" });

  return (
    <>
      {chips.map((c) => (
        <Chip key={c.key} variant={c.variant} className={chipClassName}>
          {c.label}
        </Chip>
      ))}
    </>
  );
}
