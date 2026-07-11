// Split a document into individual listing blocks by leading "N." numbering.
// Falls back to the whole text as one block when there's no numbering. Pure /
// client-safe (no AI or server imports) so it can run in the browser too.
export function splitListings(text: string): string[] {
  const parts = text.split(/\n(?=\s*\d+\.\s+\S)/);
  const blocks = parts
    .map((p) => p.trim())
    .filter((p) => /^\d+\.\s/.test(p));
  return blocks.length ? blocks : [text.trim()].filter(Boolean);
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
