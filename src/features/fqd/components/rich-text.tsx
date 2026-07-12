import { type ReactNode } from "react";

// Matches a markdown link [label](url) OR a bare http(s) URL.
const PATTERN = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+)/g;

// Render a string, turning markdown links [label](url) and bare http(s) URLs
// into anchors while leaving everything else as plain text. Parses with a regex
// and returns React elements — no dangerouslySetInnerHTML.
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  // Fresh regex instance so lastIndex state stays local to this call.
  const re = new RegExp(PATTERN.source, "g");
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = m[2] ?? m[3];
    const label = m[1] ?? m[3];
    parts.push(
      <a
        key={m.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline hover:text-blue-300 break-all"
      >
        {label}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <>{parts}</>;
}
