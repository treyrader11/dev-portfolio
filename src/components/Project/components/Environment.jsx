"use client";

import CodeEditor from "@/components/CodeEditor";

export default function Environnment({ data, title }) {
  return (
    <div className="w-full h-auto">
      {title && <h3 className="text-xl font-bold">{title}</h3>}
      <p className="mt-2">
        Make sure to add these to either{" "}
        <code className="inline-block p-1 bg-gray-200 rounded">local.env</code>{" "}
        or <code className="inline-block p-1 bg-gray-200 rounded">.env</code>{" "}
        file
      </p>

      <CodeEditor data={data} fileType=".env" />
    </div>
  );
}
