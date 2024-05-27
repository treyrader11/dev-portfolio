import { cn } from "@/lib/utils";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineFileCopy } from "react-icons/md";
import Confetti from "../Confetti";
import useCopyToClipboard from "@/hooks/useCopyClipboard";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";

export default function CodeEditor({ className, data, fileType }) {
  const [copied, copy] = useCopyToClipboard(5000);
  const { addNotification } = useNotificationsContext();

  const handleClick = (text) => {
    if (text && !copied) {
      copy(text);
      addNotification({ text: `Copied .env variables` });
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
        "py-8",
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
      <div className="p-3">
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
        <CopyIcon
          onClick={() => handleClick(data)}
          icon={copied ? FaRegCheckCircle : MdOutlineFileCopy}
          colorClass={cn({ "text-teal-400": copied })}
          text={copied ? "Copied!" : "Copy"}
        />
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
    </div>
  );
}

function CopyIcon({ icon: Icon, onClick, colorClass, text }) {
  return (
    <div onClick={onClick} className="flex items-center justify-end">
      <Icon className={cn("size-4", colorClass)} />
      <span className={cn("ml-1.5 text-sm", colorClass)}>{text}</span>
    </div>
  );
}
