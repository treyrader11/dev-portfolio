"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProjectVideo from "./ProjectVideo";
import { cn } from "@/lib/utils";
import Dependencies from "./Dependencies";

export default function ProjectDetails({ data }) {
  const [ifreamload, setifreamload] = useState(false);
  const [havecopy, sethavecopy] = useState(false);

  useEffect(() => {
    const iframe = document.getElementById("iframe");
    const handleLoad = () => {
      setifreamload(true);
    };
    if (iframe) {
      iframe.addEventListener("load", handleLoad, true);
    }
  }, []);

  const Copy = () => {
    sethavecopy(true);
    navigator.clipboard.writeText(
      "pnpm i @react-navigation/native-stack @react-navigation/native"
    );
  };

  console.log(data.video_key, "data.video_key");

  return (
    <div
      className={cn(
        "w-full",
        "800:w-[800px]",
        "h-auto",
        "flex",
        "flex-col",
        "items-start",
        "justify-start",
        "px-2.5",
        "600:px-[15px]",
        "800::px-0"
      )}
    >
      <div className="font-bold text-[25px] text-slate-200 ">{data.title}</div>
      <ProjectVideo ifreamload={ifreamload} src={data.video_key} />
      <div className="my-5">
        <span className="text-2xl font-bold text-slate-200">{data.say_xi}</span>
      </div>
      <div className="">
        <p className="text-base text-gray-300 ">{data.say_xi_blog}</p>
      </div>
      <span className={cn("font-bold text-slate-200 text-2xl mt-[15px]")}>
        Technology & Feature
      </span>
      <ul className="list-disc ml-[20px] mt-[10px] text-slate-200">
        {data.technology_feature?.map((data) => (
          <li key={data}>{data}</li>
        ))}
      </ul>
      <span className="my-5 text-2xl font-bold text-slate-200">
        About this app
      </span>
      <p className="text-gray-300 text-[15px]">{data.about_this_app}</p>
      <span className="my-5 text-2xl font-bold text-slate-200">Design</span>
      <p className="text-gray-300 text-[15px] mb-2.5">{data.design_blog}</p>
      <Dependencies data={data} />
      <span className="my-5 text-2xl font-bold text-slate-200">Conclusion</span>
      <p className="text-base text-gray-300">
        As I said at the beginning, this is a great project for begginers and
        even for those who are not new to React . I bealive this is a grat
        project to have in a resume or portfolio. I am very happy with the app
        and I hope you will enjoy it as well.
      </p>
      <span className="my-5 text-2xl font-bold select-none text-slate-200">
        Links
      </span>
      <div
        className={cn(
          "size-auto",
          "flex",
          "flex-row",
          "items-center",
          "justify-start",
          "600:justify-between",
          "flex-wrap"
        )}
      >
        <a
          href={data.youtube_link}
          className={cn(
            "px-5",
            "py-[5px]",
            "mr-2.5",
            "mb-2.5",
            "600:mb-0",
            "rounded-[6px]",
            "bg-white",
            "flex",
            "flex-row",
            "active:scale-90",
            "transition-all",
            "duration-150",
            "select-none",
            "items-center",
            "cursor-pointer",
            "hover:bg-[#f3f3f3]"
          )}
        >
          <Image
            src={"/youtube-svgrepo-com.svg"}
            className="w-[25px] h-auto"
            width={1920}
            height={1080}
            alt=""
          />
          <span className="text-black font-bold text-base ml-[6px]">
            Youtube
          </span>
        </a>
        <a
          href={data.githhub_link}
          className={cn(
            "px-5",
            "py-[5px]",
            "mr-2.5",
            "mb-2.5",
            "600:mb-0",
            "rounded-[6px]",
            "bg-white",
            "flex",
            "flex-row",
            "active:scale-90",
            "transition-all",
            "duration-150",
            "select-none",
            "items-center",
            "cursor-pointer",
            "hover:bg-[#f3f3f3]"
          )}
        >
          <Image
            src={"/github-142-svgrepo-com.svg"}
            className="w-[23px] h-auto"
            width={1920}
            height={1080}
            alt=""
          />
          <span className="text-black font-bold text-base ml-[6px]">
            Github
          </span>
        </a>
        <a
          href={data.frontend_download_link}
          className={cn(
            { hidden: data.frontend_download_link?.length },
            "px-[20px]",
            "py-[5px]",
            "mb-[10px]",
            "600:mb-0",
            "rounded-[6px]",
            "bg-white",
            "mr-2.5",
            "flex",
            "flex-row",
            "items-center",
            "active:scale-90",
            "transition-all",
            "duration-150",
            "select-none",
            "cursor-pointer",
            "hover:bg-[#f3f3f3]"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-black "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="text-black font-bold text-base ml-[6px]">
            Frontend
          </span>
        </a>
        <a
          href="https://github.com/HyatMyat4/Basic_GO_Booking_App_CLI_Project-/archive/refs/heads/main.zip"
          className={cn(
            data.backend_download_link?.length ? "" : " hidden",
            "px-5",
            "py-[5px]",
            "mb-2.5",
            "600:mb-0",
            "rounded-md",
            "bg-white",
            "flex",
            "flex-row",
            "items-center",
            "active:scale-90",
            "transition-all",
            "duration-150",
            "select-none",
            "cursor-pointer",
            "hover:bg-[#f3f3f3]"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-black size-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="text-black  font-bold text-base ml-[6px]">
            Backend
          </span>
        </a>
      </div>
      <Link
        href={"/Project"}
        className={cn(
          "flex",
          "flex-row",
          "items-center",
          "text-slate-200",
          "font-normal",
          "cursor-pointer",
          "text-base",
          "my-5"
        )}
      >
        Go Back To
        <span className="text-sky-500 ml-[5px] cursor-pointer hover:underline">
          Projects
        </span>
      </Link>
      <div className="w-full h-auto pb-[100px]" />
    </div>
  );
}