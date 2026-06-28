"use client";

import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { userData } from "@/lib/data";
import { BsDownload } from "react-icons/bs";

const { resumeUrl, resumeDocxUrl, name } = userData;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const fileName = name.replace(/\s+/g, "_");

export default function ResumeModal({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={cn("flex", "flex-col", "p-8", "text-center", "font-mono")}>
        <h2 className={cn("text-2xl", "font-semibold", "mb-2")}>
          Grab My Resume
        </h2>
        <p className={cn("text-sm", "text-gray-500", "dark:text-gray-400", "mb-6")}>
          Pick your format and let&apos;s talk.
        </p>

        <div className={cn("flex", "flex-col", "gap-3", "sm:flex-row")}>
          <a
            href={resumeUrl}
            download={`${fileName}.pdf`}
            onClick={onClose}
            className={cn(
              "flex",
              "flex-1",
              "items-center",
              "justify-center",
              "gap-2",
              "rounded-lg",
              "bg-purple-600",
              "px-4",
              "py-3",
              "text-sm",
              "font-medium",
              "text-white",
              "transition-colors",
              "hover:bg-purple-700"
            )}
          >
            <BsDownload />
            Download PDF
          </a>

          <a
            href={resumeDocxUrl}
            download={`${fileName}.docx`}
            onClick={onClose}
            className={cn(
              "flex",
              "flex-1",
              "items-center",
              "justify-center",
              "gap-2",
              "rounded-lg",
              "border",
              "border-gray-300",
              "px-4",
              "py-3",
              "text-sm",
              "font-medium",
              "text-dark",
              "transition-colors",
              "hover:bg-gray-100",
              "dark:border-gray-600",
              "dark:text-white",
              "dark:hover:bg-dark-300"
            )}
          >
            <BsDownload />
            Download Word Doc
          </a>
        </div>
      </div>
    </Modal>
  );
}
