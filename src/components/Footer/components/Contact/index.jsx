"use client";

import { motion } from "framer-motion";
import Rounded from "@/components/Rounded";
import ProfilePicture from "@/components/ProfilePicture";
import { cn } from "@/lib/utils";
import Confetti from "@/components/Confetti";
import useCopyToClipboard from "@/hooks/useCopyClipboard";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { userData } from "@/lib/data";

const { email, phone } = userData;

export default function Contact({ style, rotate }) {
  const [copied, copy] = useCopyToClipboard(500);
  const { addNotification } = useNotificationsContext();

  const handleCopy = (text) => {
    if (text) {
      copy(text);
      addNotification({ text: `Copied: ${text}` });
    }
  };

  return (
    <div
      className={cn(
        "pt-[200px]",
        "w-full",
        "bg-dark",
        "px-6",
        "sm:px-20",
        "lg:px-[10rem]",
        "relative"
      )}
    >
      <Confetti copied={copied} />
      <div
        className={cn(
          "border-b-[.5px]",
          "flex",
          "justify-between",
          "items-center",
          "border-light-300/70"
        )}
      >
        <div>
          <span className="flex items-center">
            <ProfilePicture
              className="size-[9vw]"
              src={"/images/portraits/profile-coffee.png"}
              isBlob
            />
            <h2 className="ml-[0.3em] tracking-tighter text-[9vw] md:text-[6vw]">
              Let&apos;s talk
            </h2>
          </span>
          <h2 className="text-[9vw] tracking-tighter font-light md:text-[6vw]">
            code
          </h2>
          <motion.div
            style={style}
            className={
              cn()
              // "absolute",
              // "left-[calc(100%_-_275px)]",
              // "md:left-[calc(100%_-_380px)]",
              // "lg:left-[calc(100%_-_500px)]",
              // "top-[calc(100%_-_655px)]",
              // "md:top-[calc(100%_-_485px)]"
            }
          >
            <Rounded
              text="Get in touch"
              backgroundColor="#A25600"
              href="/contact"
              className={cn(
                "size-[140px]",
                "rounded-full",
                "bg-secondary",
                "p-0",
                "left-[calc(100%_-_0px)]",
                "md:left-[calc(100%_-_-100px)]",
                "lg:left-[calc(100%_-_-200px)]",
                "xl:left-[calc(100%_-_-350px)]",
                "top-[calc(100%_-_70px)]",
                "absolute"
              )}
            />
          </motion.div>
        </div>
        <motion.svg
          style={{ rotate, scale: 2 }}
          width="8"
          height="8"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className=""
        >
          <path
            d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
            fill="white"
          />
        </motion.svg>
      </div>

      <div
        className={cn(
          "flex",
          "flex-col",
          "md:flex-row",
          "gap-5",
          "mt-[100px]",
          "items-center"
        )}
      >
        <Rounded
          onClick={() => handleCopy("trey@treyrader.dev")}
          text={email}
          className={cn("w-full md:w-fit py-5 px-10 border-[.3px]")}
        />
        <div className={cn("w-full")}>
          <Rounded
            onClick={() => handleCopy("5047564538")}
            className={cn("md:w-fit py-5 px-10 border-[.3px]")}
          >
            <p
              className={cn(
                "relative",
                "z-[1]",
                "transition-colors",
                "duration-400",
                "ease-linear"
              )}
            >
              {phone}
            </p>
          </Rounded>
        </div>
      </div>
    </div>
  );
}
