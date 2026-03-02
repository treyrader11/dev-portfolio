import { cn } from "@/lib/utils";
import { tagColors } from "@/lib/data";
import type { TagColors } from "@/types/data";

interface Props {
  data: string[];
  className?: string;
}

export default function Tags({ data, className }: Props) {
  return (
    <ul className={cn("flex gap-3 max-w-[20vw] flex-wrap", className)}>
      {data.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </ul>
  );
}

interface TagProps {
  className?: string;
  tag: string;
}

function Tag({ className, tag }: TagProps) {
  const color = (tagColors as TagColors)[tag] || (tagColors as TagColors)["default"];
  return (
    <li style={{ color }} className={cn("text-sm font-semibold", className)}>
      {tag.length ? `#${tag}` : ""}
    </li>
  );
}
