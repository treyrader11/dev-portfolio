import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import {
  metaDescriptions as fallbackMeta,
  ctaTexts as fallbackCta,
  tagColors as fallbackTagColors,
} from "@/lib/data";
import type { GetServerSideProps } from "next";
import type { MetaDescriptions, CtaTexts, TagColors } from "@/types/data";

interface Props {
  metaDescriptions: MetaDescriptions;
  ctaTexts: CtaTexts;
  tagColors: TagColors;
}

export default function AdminSettings({
  metaDescriptions: initialMeta,
  ctaTexts: initialCta,
  tagColors: initialTags,
}: Props) {
  const [meta, setMeta] = useState(initialMeta);
  const [cta, setCta] = useState(initialCta);
  const [tagColors, setTagColors] = useState(initialTags);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");

  async function saveConfig(key: string, value: unknown) {
    setSaving(key);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/config/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      setMessage(res.ok ? `${key} saved!` : "Failed to save.");
    } catch {
      setMessage("An error occurred.");
    }
    setSaving("");
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl space-y-8">
        {/* Meta Descriptions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            SEO Meta Descriptions
          </h2>
          <div className="space-y-4">
            {(Object.keys(meta) as Array<keyof MetaDescriptions>).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <textarea
                  value={meta[key]}
                  onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => saveConfig("metaDescriptions", meta)}
            disabled={saving === "metaDescriptions"}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving === "metaDescriptions" ? "Saving..." : "Save Meta"}
          </button>
        </div>

        {/* CTA Texts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Call-to-Action Texts
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(cta) as Array<keyof CtaTexts>).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  value={cta[key]}
                  onChange={(e) => setCta({ ...cta, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => saveConfig("ctaTexts", cta)}
            disabled={saving === "ctaTexts"}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving === "ctaTexts" ? "Saving..." : "Save CTAs"}
          </button>
        </div>

        {/* Tag Colors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tag Colors
          </h2>
          <div className="space-y-2">
            {Object.entries(tagColors).map(([tag, color]) => (
              <div key={tag} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-32">
                  {tag}
                </span>
                <input
                  value={color}
                  onChange={(e) =>
                    setTagColors({ ...tagColors, [tag]: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
                <div
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <button
                  onClick={() => {
                    const next = { ...tagColors };
                    delete next[tag];
                    setTagColors(next);
                  }}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                const name = prompt("Tag name:");
                if (name) setTagColors({ ...tagColors, [name]: "#6b7280" });
              }}
              className="text-sm text-blue-600"
            >
              + Add tag color
            </button>
          </div>
          <button
            onClick={() => saveConfig("tagColors", tagColors)}
            disabled={saving === "tagColors"}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving === "tagColors" ? "Saving..." : "Save Tag Colors"}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm ${message.includes("saved") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const [metaConfig, ctaConfig, tagConfig] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { key: "metaDescriptions" } }),
    prisma.siteConfig.findUnique({ where: { key: "ctaTexts" } }),
    prisma.siteConfig.findUnique({ where: { key: "tagColors" } }),
  ]);

  return {
    props: {
      metaDescriptions: metaConfig
        ? (metaConfig.value as unknown as MetaDescriptions)
        : fallbackMeta,
      ctaTexts: ctaConfig
        ? (ctaConfig.value as unknown as CtaTexts)
        : fallbackCta,
      tagColors: tagConfig
        ? (tagConfig.value as unknown as TagColors)
        : fallbackTagColors,
    },
  };
};
