import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";

export function CopyButton({ onClick, icon: Icon, text, textColor }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "right-[10px]",
        "top-[10px]",
        "absolute",
        "hidden",
        "group-hover:flex",
        "flex-row",
        "items-center",
        "px-[15px]",
        "py-[5px]",
        "cursor-pointer",
        "rounded-[5px]"
      )}
    >
      <Icon className={cn("size-5", textColor)} />
      <span className={cn("ml-[7px]", "text-base", textColor)}>{text}</span>
    </div>
  );
}

export default function CopyContent({ content, className }) {
  const [haveCopy, setHaveCopy] = useState(false);

  const handleCopy = () => {
    setHaveCopy(true);
    navigator.clipboard.writeText(content);
    const timeout = setTimeout(() => {
      setHaveCopy(false);
      clearTimeout(timeout);
    }, 5000);
  };

  return (
    <div className={className}>
      {haveCopy ? (
        <CopyButton
          onClick={() => setHaveCopy(false)}
          icon={FaRegCheckCircle}
          text="Copied!"
          textColor="text-teal-400"
        />
      ) : (
        <CopyButton
          onClick={handleCopy}
          icon={LuCopyCheck}
          text="Copy"
          textColor="text-white"
        />
      )}
    </div>
  );
}
