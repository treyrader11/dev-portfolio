"use client";

import { FaRegCheckCircle } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Confetti from "@/components/Confetti";
import useCopyToClipboard from "@/hooks/useCopyClipboard";
import { useNotificationsContext } from "@/providers/notificationsProvider";

export default function Environnment({ data, title }) {
  const [copied, copy] = useCopyToClipboard(5000);

  // const { addNotification } = useNotifications();
  const { addNotification } = useNotificationsContext();

  const handleClick = (text) => {
    if (text) {
      console.log(`Copying text: ${text}`);
      copy(text);
      addNotification({ text: `Copied: ${text}` });
    }
  };

  return (
    <div className="w-full h-auto">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2">
        Make sure to add these to either{" "}
        <code className="inline-block p-1 bg-gray-200 rounded code-editor">
          local.env
        </code>{" "}
        or{" "}
        <code className="inline-block p-1 bg-gray-200 rounded code-editor">
          .env
        </code>{" "}
        file
      </p>

      <div
        className={cn(
          "my-4",
          "w-full",
          "h-auto",
          "relative",
          "group",
          "py-4",
          "px-2.5",
          "border",
          "text-slate-200",
          "rounded-lg",
          "bg-[linear-gradient(110deg,#181818,45%,#1e2631,55%,#181818)]",
          "border",
          "border-purple-500",
          "shadow-2xl"
        )}
      >
        <div className={cn("py-3", "px-3")}>
          <code className="whitespace-pre text-[#588A44]"># .env</code>
        </div>
        {data.map((data) => (
          <div
            key={data}
            className={cn(
              "w-full",
              "h-auto",
              "hover:bg-gray-300/20",
              "rounded",
              "px-4",
              "text-[#4688CC]"
            )}
          >
            {data}
            {data.includes("NEXT_PUBLIC_APP_URL") ? (
              <>
                <span className="text-sm text-neutral-300">{`=`}</span>
                <span className="text-[#BE7C64]">{`"http://localhost:3000"`}</span>
              </>
            ) : (
              <>
                <span className="text-sm text-neutral-300">{`=`}</span>
                <span className="text-[#BE7C64]">{`""`}</span>
              </>
            )}
          </div>
        ))}

        <Confetti copied={copied} />

        {copied ? (
          <div
            // onClick={() => setCopied(false)}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-4",
              "py-[5px]",
              "cursor-pointer",
              "rounded-[5px]"
            )}
          >
            <FaRegCheckCircle className="text-teal-400 size-5" />
            <span className="ml-1.5 text-teal-400">Copied!</span>
          </div>
        ) : (
          <div
            // onClick={() => copy(data[0].env)}
            // onClick={() => handleClick(data[0].env)}
            onClick={() => handleClick(data[0])}
            className={cn(
              "right-[10px]",
              "top-[10px]",
              "absolute",
              "hidden",
              "group-hover:flex",
              "flex-row",
              "items-center",
              "px-4",
              "py-[5px]",
              "cursor-pointer",
              "rounded-md"
            )}
          >
            <LuCopyCheck className="text-white size-5" />
            <span className="ml-1.5">Copy</span>
          </div>
        )}
      </div>
    </div>
  );
}
