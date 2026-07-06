import type { NextApiRequest, NextApiResponse } from "next";
import { generateText } from "ai";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getFirstAvailableModel } from "@/lib/ai/providers";
import { parsePackageDeps } from "@/features/portfolio/lib/parse-config";

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

// The categories the AI may pick from when it can't match an existing tab.
const ALLOWED_CATEGORIES = [
  "Next.js",
  "Next.JS",
  "Next.JS, iOS React Native",
  "MERN",
  "Full-Stack Web & Mobile",
];

interface AnalyzeResult {
  filterCategory: string;
  tags: string[];
  technologyFeatures: string[];
}

// Pull the first JSON object out of the model's text (tolerates stray prose or
// ```json fences) and coerce it into the shape we expect.
function parseAiJson(text: string): AnalyzeResult | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const raw = JSON.parse(text.slice(start, end + 1)) as Record<
      string,
      unknown
    >;
    const asStrings = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    return {
      filterCategory:
        typeof raw.filterCategory === "string" ? raw.filterCategory : "",
      tags: asStrings(raw.tags),
      technologyFeatures: asStrings(raw.technologyFeatures),
    };
  } catch {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!(await requireAdmin(req, res))) return;

  const { packageJson } = req.body as { packageJson?: string };
  if (!packageJson || typeof packageJson !== "string" || !packageJson.trim()) {
    return res.status(400).json({ error: "packageJson is required" });
  }

  // Validate the JSON up front so we never spend an AI call on garbage.
  let parsed: Record<string, unknown>;
  try {
    const json = JSON.parse(packageJson);
    if (typeof json !== "object" || json === null || Array.isArray(json)) {
      throw new Error("not an object");
    }
    parsed = json as Record<string, unknown>;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Collect dependency names (deps + devDeps) for the AI to reason over.
  const isRecord = (v: unknown): v is Record<string, string> =>
    typeof v === "object" && v !== null && !Array.isArray(v);
  const depNames = new Set<string>();
  if (isRecord(parsed.dependencies))
    Object.keys(parsed.dependencies).forEach((n) => depNames.add(n));
  if (isRecord(parsed.devDependencies))
    Object.keys(parsed.devDependencies).forEach((n) => depNames.add(n));
  const dependencyList = [...depNames].sort();

  if (dependencyList.length === 0) {
    return res
      .status(400)
      .json({ error: "No dependencies found in package.json" });
  }

  // Deterministic package lines for the Packages field — same parser the manual
  // paste uses, so the shape matches exactly.
  const packages = parsePackageDeps(packageJson) ?? [];

  // Existing categories so the AI can land on a real filter tab when one fits.
  let existingCategories: string[] = [];
  try {
    const rows = await prisma.project.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    existingCategories = rows
      .map((r) => r.category)
      .filter((c): c is string => Boolean(c && c.trim()));
  } catch {
    // Non-fatal — just fall back to ALLOWED_CATEGORIES guidance.
  }

  const system = `You are analyzing a package.json file for a developer portfolio project. Based on the dependencies provided, infer and return a JSON object with these exact fields:

{
  "filterCategory": "one of: ${ALLOWED_CATEGORIES.join(" | ")}",
  "tags": ["array", "of", "lowercase", "hashtag", "strings", "without", "the", "#"],
  "technologyFeatures": ["array", "of", "human", "readable", "technology", "names"]
}

Rules:
- filterCategory: pick the single best match from the allowed values based on the stack${
    existingCategories.length
      ? `. If one of these existing portfolio categories is a good match, prefer it exactly: ${existingCategories
          .map((c) => `"${c}"`)
          .join(", ")}`
      : ""
  }
- tags: infer 8-12 relevant tags from the dependencies (e.g. "nextjs", "typescript", "prisma", "framer-motion")
- technologyFeatures: human-readable names for the key technologies (e.g. "Next.js (App Router)", "Prisma ORM", "Framer Motion", "Tailwind CSS")
- Return only valid JSON, no explanation, no markdown`;

  try {
    const { text } = await generateText({
      model: getFirstAvailableModel(),
      system,
      prompt: `Dependencies:\n${dependencyList.join("\n")}`,
    });

    const result = parseAiJson(text);
    if (!result) {
      return res.status(502).json({ error: "AI returned an unparseable response" });
    }

    return res.status(200).json({
      filterCategory: result.filterCategory,
      tags: result.tags,
      technologyFeatures: result.technologyFeatures,
      packages,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to analyze package.json";
    return res.status(500).json({ error: message });
  }
}
