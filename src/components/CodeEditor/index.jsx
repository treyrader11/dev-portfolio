import { cn } from "@/lib/utils";
import { LuCopyCheck } from "react-icons/lu";
import { FaRegCheckCircle } from "react-icons/fa";
import Confetti from "../Confetti";
import useCopyToClipboard from "@/hooks/useCopyClipboard";
import { useNotificationsContext } from "@/providers/NotificationsProvider";

export default function CodeEditor({ className, data, fileType }) {
  const [copied, copy] = useCopyToClipboard(5000);
  const { addNotification } = useNotificationsContext();

  const handleClick = (text) => {
    if (text) {
      console.log(`Copying text: ${text}`);
      copy(text);
      addNotification({ text: `Copied: .env variables` });
    }
  };
  return (
    <div
      className={cn(
        "my-4",
        "w-full",
        "h-auto",
        "relative",
        "group",
        "py-4",
        "pt-8",
        "px-2.5",
        "border",
        "text-slate-200",
        "rounded-lg",
        "bg-[linear-gradient(110deg,#181818,45%,#1e2631,55%,#181818)]",
        "border",
        "border-purple-500",
        "shadow-2xl",
        className
      )}
    >
      <div className={cn("py-3", "px-3")}>
        <code className="whitespace-pre text-[#588A44]"># {fileType}</code>
      </div>
      <div
        className={cn(
          "absolute",
          "top-0",
          "inset-x-0",
          "py-2",
          "px-4",
          "bg-dark-600",
          "text-gray-300",
          "font-light",
          "group",
          "hover:cursor-pointer"
        )}
      >
        {copied ? (
          <div className="flex items-center justify-end">
            <FaRegCheckCircle className="text-teal-400 size-4" />
            <span className="ml-1.5 text-teal-400 text-sm">Copied!</span>
          </div>
        ) : (
          <div
            className="flex items-center justify-end"
            onClick={() => handleClick(data)}
          >
            <LuCopyCheck className="size-4" />
            <span className="ml-1.5 text-sm">Copy</span>
          </div>
        )}
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

      {/* <div
          onClick={() => handleClick(data)}
          className={cn(
            "right-[10px]",
            "top-[10px]",
            "absolute",
            "hidden",
            // "group-hover:flex",
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
        </div> */}
    </div>
  );
}
