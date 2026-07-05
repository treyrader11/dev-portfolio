// Deterministic parsers for the admin "paste your config" dropzones. No AI:
// .env is KEY=VALUE lines and package.json is JSON, both fully parseable locally.

// Extract the variable KEYS from pasted .env content. The public Environment
// block renders each key as KEY="" (values are never stored), so we only keep
// the names. Handles `export KEY=...`, comments, blank lines, and quotes.
export function parseEnvKeys(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => {
      const withoutExport = line.replace(/^export\s+/, "");
      const eq = withoutExport.indexOf("=");
      const key = eq === -1 ? withoutExport : withoutExport.slice(0, eq);
      return key.trim();
    })
    .filter(Boolean);
}

// Turn a pasted package.json (or a bare dependencies object) into pretty
// `"name": "version"` lines for the Technology code block. Merges dependencies
// and devDependencies, de-dupes, and sorts. Returns null if the text isn't
// valid JSON so the caller can surface a parse error.
export function parsePackageDeps(text: string): string[] | null {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof json !== "object" || json === null) return null;

  const obj = json as Record<string, unknown>;
  const isRecord = (v: unknown): v is Record<string, string> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

  // Accept either a full package.json (with dependencies/devDependencies) or a
  // bare { "name": "version" } dependency map pasted on its own.
  const deps: Record<string, string> = {};
  if (isRecord(obj.dependencies)) Object.assign(deps, obj.dependencies);
  if (isRecord(obj.devDependencies)) Object.assign(deps, obj.devDependencies);
  if (!isRecord(obj.dependencies) && !isRecord(obj.devDependencies)) {
    // Bare dependency map: keep only string values (name -> version).
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") deps[k] = v;
    }
  }

  const entries = Object.entries(deps);
  if (entries.length === 0) return null;
  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, version]) => `"${name}": "${version}"`);
}

// True when a project's env has no keys in either list — used to hide the
// Environment section entirely on the public page.
export function isEnvEmpty(env?: {
  general?: string[];
  frontend?: string[];
  backend?: string[];
}): boolean {
  const g = env?.general?.filter(Boolean) ?? [];
  const f = env?.frontend?.filter(Boolean) ?? [];
  const b = env?.backend?.filter(Boolean) ?? [];
  return g.length === 0 && f.length === 0 && b.length === 0;
}

// True when a project's packages have no entries in either list.
export function isPackagesEmpty(packages?: {
  frontend?: string[];
  backend?: string[];
}): boolean {
  const f = packages?.frontend?.filter(Boolean) ?? [];
  const b = packages?.backend?.filter(Boolean) ?? [];
  return f.length === 0 && b.length === 0;
}
