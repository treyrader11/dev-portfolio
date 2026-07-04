import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  // Pre-formatted `"name": "version"` dependency lines (see parsePackageDeps).
  lines: string[];
  // Filename label shown at the top of the block, e.g. "package.json".
  fileType?: string;
  title?: string | null;
}

// A read-only, syntax-tinted code container that renders parsed package.json
// dependencies as a formatted JSON snippet. Mirrors the .env CodeEditor styling
// so the admin preview matches the public Technology section exactly. Reusable
// on both the admin project form and the public project page.
export default function PackagesCodeBlock({
  className,
  lines,
  fileType = "package.json",
  title,
}: Props) {
  return (
    <div className="w-full">
      {title && <h3 className="text-xl font-bold">{title}</h3>}
      <div
        className={cn(
          "my-4 w-full rounded-lg border border-purple-500 px-2.5 py-8 text-slate-200 shadow-2xl",
          "bg-[linear-gradient(110deg,#181818,45%,#1e2631,55%,#181818)]",
          className,
        )}
      >
        <div className="p-3">
          <code className="whitespace-pre text-[#588A44]">
            <i>#</i> {fileType}
          </code>
        </div>
        <code className="block whitespace-pre px-4 font-mono text-sm">
          <span className="text-neutral-300">{"{"}</span>
          {"\n"}
          <span className="text-[#588A44]">{'  "dependencies": {'}</span>
          {"\n"}
          {lines.map((line, i) => {
            // line is `"name": "version"`; tint key vs value separately.
            const m = line.match(/^("[^"]*"):\s*(.*)$/);
            const key = m ? m[1] : line;
            const value = m ? m[2] : "";
            const comma = i < lines.length - 1 ? "," : "";
            return (
              <span key={line}>
                {"    "}
                <span className="text-[#4688CC]">{key}</span>
                {value && <span className="text-neutral-300">: </span>}
                <span className="text-[#BE7C64]">{value}</span>
                <span className="text-neutral-300">{comma}</span>
                {"\n"}
              </span>
            );
          })}
          <span className="text-[#588A44]">{"  }"}</span>
          {"\n"}
          <span className="text-neutral-300">{"}"}</span>
        </code>
      </div>
    </div>
  );
}
