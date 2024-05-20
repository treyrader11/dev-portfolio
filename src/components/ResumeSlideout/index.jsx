import { cn } from "@/lib/utils";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { userData } from "@/lib/data";

export default function ResumeSlideout({ className }) {
  return (
    <div
      className={cn(
        "w-[160px]",
        "h-[60px]",
        "flex",
        "justify-between",
        "items-center",
        "ml-[-100px]",
        "hover:-ml-2.5",
        "duration-300",
        "bg-purple-600",
        "bg-teal-600",
        "fixed",
        "z-10",
        "rounded-r-lg",
        "bottom-14",
        className
      )}
    >
      <a
        className={cn(
          "flex",
          "items-center",
          "justify-between",
          "w-full",
          "text-gray-300"
        )}
        href={userData.resumeUrl}
      >
        Resume <BsFillPersonLinesFill size={30} />
      </a>
    </div>
  );
}
