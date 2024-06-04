import { cn } from "@/lib/utils";
import { tagColors } from "@/lib/data";

export default function Tags({ data, className }) {
  return (
    <ul className={cn("flex gap-3 max-w-[20vw] flex-wrap", className)}>
      {data.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </ul>
  );
}

function Tag({ className, tag }) {
  const color = tagColors[tag] || tagColors["default"];
  return (
    <li style={{ color }} className={cn("text-sm font-semibold", className)}>
      {tag.length ? `#${tag}` : ""}
    </li>
  );
}
