import { cn } from "@/lib/utils";
import type {
  ContributionDay,
  GithubContributionCalendar,
} from "../types";

interface Props {
  data: GithubContributionCalendar | null;
  username?: string;
  className?: string;
}

// GitHub's default (light) legend colors — empty → most active.
const LEGEND_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
// Row labels (Sun..Sat). GitHub only shows Mon / Wed / Fri.
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// A GitHub-style contribution heatmap: weeks as columns, weekdays as rows, each
// cell colored exactly as GitHub colors it. Renders nothing when there's no data
// (e.g. no GitHub token configured), so the page just omits the section.
export default function GithubContributions({
  data,
  username,
  className,
}: Props) {
  if (!data || data.weeks.length === 0) return null;

  // Pad each week into a fixed 7-row (Sun..Sat) column so rows align by weekday
  // even when the first/last week is partial. `null` = a day outside the range.
  const columns = data.weeks.map((week) => {
    const slots: (ContributionDay | null)[] = Array(7).fill(null);
    for (const day of week) {
      slots[new Date(day.date).getUTCDay()] = day;
    }
    return slots;
  });

  // Label a column when its first in-range day starts a new month.
  const monthLabels = columns.map((col, i) => {
    const firstDay = col.find(Boolean);
    if (!firstDay) return "";
    const month = new Date(firstDay.date).getUTCMonth();
    const prevFirst = columns[i - 1]?.find(Boolean);
    const prevMonth = prevFirst
      ? new Date(prevFirst.date).getUTCMonth()
      : -1;
    return month !== prevMonth ? MONTHS[month] : "";
  });

  return (
    <section className={cn("w-full pt-40", className)}>
      <div className="mx-auto max-w-6xl px-8">
        <div className="rounded-md border border-gray-200 bg-white p-4 text-gray-700 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-800">
              {data.totalContributions.toLocaleString()} contributions in the
              last year
            </h2>
            {username && (
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
              >
                @{username}
              </a>
            )}
          </div>

          {/* Horizontal scroll on small screens — the full year is ~53 columns. */}
          <div className="overflow-x-auto pb-1 [scrollbar-width:thin]">
            <div className="inline-flex flex-col gap-1">
              {/* Month labels — each overflows right from the column it marks. */}
              <div className="flex pl-8">
                <div className="flex gap-[3px]">
                  {monthLabels.map((label, i) => (
                    <div
                      key={i}
                      className="relative h-3 w-[11px] text-[10px] leading-3 text-gray-500"
                    >
                      {label && (
                        <span className="absolute left-0 top-0 whitespace-nowrap">
                          {label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekday labels + the grid of day cells. */}
              <div className="flex gap-[3px]">
                <div className="flex w-8 flex-col gap-[3px] pr-1">
                  {WEEKDAY_LABELS.map((label, r) => (
                    <div
                      key={r}
                      className="h-[11px] text-right text-[10px] leading-[11px] text-gray-500"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {columns.map((col, ci) => (
                  <div key={ci} className="flex flex-col gap-[3px]">
                    {col.map((day, r) => (
                      <div
                        key={r}
                        title={
                          day
                            ? `${day.count} contribution${
                                day.count === 1 ? "" : "s"
                              } on ${day.date}`
                            : undefined
                        }
                        className="h-[11px] w-[11px] rounded-[2px]"
                        style={{
                          backgroundColor: day ? day.color : "transparent",
                          outline: day
                            ? "1px solid rgba(27,31,35,0.06)"
                            : "none",
                          outlineOffset: "-1px",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-end gap-1 text-[11px] text-gray-500">
            <span className="mr-1">Less</span>
            {LEGEND_COLORS.map((color) => (
              <div
                key={color}
                className="h-[11px] w-[11px] rounded-[2px]"
                style={{
                  backgroundColor: color,
                  outline: "1px solid rgba(27,31,35,0.06)",
                  outlineOffset: "-1px",
                }}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
