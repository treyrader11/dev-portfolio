"use client";

import { cn } from "@/lib/utils";
import Magnetic from "@/components/Magnetic";
import { userData } from "@/lib/data";
import { VscCoffee } from "react-icons/vsc";
import Socials from "@/components/Socials";
import BlurredIn from "@/components/BlurredIn";
import GridGlobe from "@/components/GridGlobe";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import useCopyToClipboard from "@/hooks/useCopyClipboard";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import PageCurve from "@/components/PageCurve";
import Stars from "@/components/Stars";
import ContactForm from "./components/ContactForm";
import { FaPhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { MdPushPin } from "react-icons/md";

const { phone, email, address } = userData;

export default function Contact() {
  const [copied, copy] = useCopyToClipboard(500);
  const { addNotification } = useNotificationsContext();
  const container = useRef(null);

  const handleCopy = (text) => {
    if (text) {
      copy(text);
      addNotification({ text: `Copied: ${text}` });
    }
  };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <section className="bg-dark">
      <BlurredIn
        once
        className={cn(
          "relative",
          "rounded-md",
          "shadow-md",
          "p-4",
          "md:p-10",
          "lg:p-20",
          "max-w-6xl",
          "mx-auto",
          "mb-20",
          "-mt-4"
        )}
      >
        <Stars className="opacity-60 z-[-1]" backgroundColor="#cd9f79" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:ml-4">
            <header className="pt-10">
              <h1
                className={cn(
                  "flex",
                  "items-center",
                  "text-2xl",
                  "font-semibold",
                  "gap-x-2",
                  "text-gray-50",
                  "font-pp-acma"
                )}
              >
                Let&apos;s talk. <VscCoffee className="text-28" />
              </h1>
              <p className="mt-2 text-base font-light text-gray-200">
                Please leave a detailed message and I&apos;ll likely get back to
                you in the morning. Thanks!
              </p>
            </header>
            <div className="inline-flex flex-col my-10">
              <Magnetic>
                <div
                  onClick={() => handleCopy("5047564538")}
                  className={cn(
                    "flex",
                    "flex-row",
                    "items-center",
                    "space-x-6",
                    "rounded-md",
                    "p-4",
                    "cursor-pointer"
                  )}
                >
                  <FaPhone className="text-purple-500 size-4" />
                  <p className="text-sm font-light text-gray-50">{phone}</p>
                </div>
              </Magnetic>
              <Magnetic>
                <a
                  href={`mailto:${email}`}
                  className={cn(
                    "flex",
                    "flex-row",
                    "items-center",
                    "space-x-6",
                    "rounded-md",
                    "p-4"
                  )}
                >
                  <IoMdMail className="text-purple-500 size-4" />
                  <p className="text-sm font-light text-gray-50">{email}</p>
                </a>
              </Magnetic>
              <Magnetic>
                <div
                  className={cn(
                    "flex",
                    "flex-row",
                    "items-center",
                    "space-x-6",
                    "rounded-md",
                    "p-4"
                  )}
                >
                  <MdPushPin className="text-purple-500 size-4" />
                  <p className="text-sm font-light text-gray-50">{address}</p>
                </div>
              </Magnetic>
            </div>
            <Socials rounded />
          </div>

          <div className={cn("flex gap-2 flex-col ")}>
            <div
              className={cn(
                "hover:translate-x-2",
                "transition",
                "duration-200",
                "relative",
                "md:h-full",
                "min-h-48",
                "flex",
                "flex-col",
                "overflow-hidden"
              )}
            >
              <GridGlobe />
            </div>
            <ContactForm />
          </div>
        </div>
      </BlurredIn>
      <div className={cn("bg-slate-100 h-[20vh]")} />
      {/* <PageCurve height={height} /> */}
    </section>
  );
}
