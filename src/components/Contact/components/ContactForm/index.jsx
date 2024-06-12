"use client";

import { cn } from "@/lib/utils";
import Input from "@/components/Input";
import Rounded from "@/components/Rounded";
import Magnetic from "@/components/Magnetic";
import { userData } from "@/lib/data";
import { VscSend } from "react-icons/vsc";
import { useRef, forwardRef, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import gsap from "gsap";
import PaperPlane from "../PaperPlane";
import { getPlaneKeyframes } from "../../getPlaneKeyframes";
import { getTrailsKeyframes } from "../../getTrailsKeyframes";

export default function ContactForm({ className }) {
  const [input, setInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  // const [isActive, setIsActive] = useState(true);
  const buttonRef = useRef(null);
  const { to, fromTo, set } = gsap;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = input;
    const button = buttonRef.current;

    if (!email || !button) return;

    if (!isActive) {
      setIsActive(true);

      to(button, {
        keyframes: getPlaneKeyframes(
          set,
          fromTo,
          button,
          setIsActive,
          setInput
        ),
      });

      to(button, { keyframes: getTrailsKeyframes(button) });
    }

    const res = await fetch("/api/addSubscription", {
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await res.json();

    if (data.error) {
      setErrorMessage("Hey, you are already subscribed!");
      setSuccessMessage(undefined);
      return;
    }

    setSuccessMessage(data.res);
    setErrorMessage("");
  };

  const dismissMessages = () => {
    setSuccessMessage(undefined);
    setErrorMessage("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        action=""
        className={cn(
          "newsletter-form",
          "animate-fade-in-3",
          "flex",
          "z-[999]",
          "relative",
          "bg-transparent",
          "flex-col",
          "gap-[1.2rem]",
          className
        )}
      >
        <div className="flex gap-4 bg-transparent">
          <Input
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Your name"
          />
          {/* <FaRegEnvelope
            className={cn(
              "hidden",
              "sm:inline",
              "size-6",
              "text-[#4B4C52]",
              "group-focus-within:text-white",
              "group-hover:text-white",
              "transition-colors",
              "duration-300"
            )}
          /> */}

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="email"
            placeholder="Email address"
          />
        </div>
        <Input
          // value={input}
          // onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Subject"
        />
        <textarea
          name=""
          id=""
          cols="30"
          rows="6"
          placeholder="Message"
          className={cn(
            "w-full",
            "py-4",
            "px-6",
            "rounded-[30px]",
            "outline-none",
            "border-none",
            "resize-none",
            "focus:outline-purple-400",
            "outline-[1px]",
            "transition-all",
            "duration-300",
            "ease-in-out",
            "bg-slate-100",
            "text-black"
          )}
        />

        <Submit ref={buttonRef} input={input} isActive={isActive} />
        {/* Old button below */}
        {/* <Rounded backgroundColor="#8550C2">
        <p className="flex relative z-[10] items-center gap-2">
          Send <VscSend />
        </p>
      </Rounded> */}
      </form>

      <div className="relative">
        {(successMessage || errorMessage) && (
          <div
            className={cn(
              "flex",
              "items-start",
              "space-x-2",
              "bg-[#0A0E12]",
              // "shadow-outline-gray",
              "shadow-2xl",
              "text-white",
              "rounded-[9px]",
              "py-4",
              "px-6",
              "animate-fade-bottom",
              "absolute"
            )}
          >
            <div
              className={cn(
                "size-[66px]",
                "bg-[#1B2926]",
                "flex",
                "items-center",
                "justify-center",
                "rounded-full border",
                "border-[#273130]",
                "flex-shrink-0"
              )}
            >
              <FaRegCircleCheck className="size-4 text-[#81A89A]" />
            </div>
            <div className="text-xs sm:text-sm text-[#4B4C52]">
              {successMessage ? (
                <p>
                  We&apos;ve added{" "}
                  <span className="text-[#ADB0B1]">
                    {successMessage.email_address}
                  </span>{" "}
                  to our waitlist. We&apos;ll let you know when we launch!
                </p>
              ) : (
                <p>
                  You are already added to our waitlist. We&apos;ll let you know
                  when we launch!
                </p>
              )}
            </div>
            <IoCloseCircleOutline
              className={cn(
                "size-5",
                "cursor-pointer",
                "flex-shrink-0",
                "text-[#4A4B55]"
              )}
              onClick={dismissMessages}
            />
          </div>
        )}
      </div>
    </>
  );
}

const Submit = forwardRef(({ isActive, input }, ref) => {
  return (
    // <Rounded
    //   // ref={ref}
    //   backgroundColor="#8550C2"
    // >
    <button
      style={{ WebkitTapHighlightColor: "transparent" }}
      ref={ref}
      className={cn(
        { active: isActive },
        "disabled:!bg-[#17141F]",
        "disabled:grayscale-[65%]",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
        "text-sm",
        "md:text-base",
        "relative",
        "py-2",
        "min-4-[100px]",
        "text-center",
        "text-white",
        "rounded-full",
        "[transform:translateZ(0)]",
        "transition-[opacity,filter]",
        "duration-[0.25s]",

        "flex",
        "justify-center",

        "items-center",
        "w-full",
        "mx-auto",
        "py-6"
      )}
      disabled={!input}
      type="submit"
    >
      <span
        className={cn(
          // "default",
          "relative",
          "z-[4]",

          //my styles
          "flex",
          "items-center",
          "gap-2",
          { "opacity-0": isActive }
        )}
      >
        Send <VscSend />
      </span>

      <span
        className={cn(
          // success determines animation/transform
          "success", 
          "text-emerald-500",
          "z-0",
          "absolute",
          "inset-x-0",
          "top-2",
          "-translate-x-3",
          "flex",
          "justify-normal",
          "items-center",
          // "[transform:translateX(-3px)_translateZ(0)]",
          "opacity-0",
          // "text-xl",
          { "opacity-100 [transform:translateX(-3px)_translateZ(0)]": isActive }
        )}
      >
        <svg
          // This is the check mark
          // style={{ strokeDasharray: "14px", strokeDashoffset: "14px" }}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={14}
          // strokeDashoffset={isActive ? 0 : 14}
          className={cn(
            // "trails",
            "stroke-2",
            "w-6",
            "stroke-emerald-500",
            "pointer-events-none"
            // "absolute",
            // // "opacity-0",
            // "inset-x-0",
            // "mx-auto",
            // "ml-10",
            // { " opacity-100": isActive }
          )}
          viewBox="0 0 16 16"
        >
          <polyline points="3.75 9 7 12 13 5" />
        </svg>
        Sent
      </span>

      {/* Not sure what .trails is */}
      {/* <svg
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={14}
        strokeDashoffset={14}
        className={cn(
          "trails",
          "inline-block",
          "align-top",
          "size-4",
          "mt-1",
          "mr-2",
          "fill-none",
          "stroke-2",
          "stroke-purple-500",
          ""
        )}
        viewBox="0 0 33 64"
      >
        <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60"></path>
        <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60"></path>
      </svg> */}
      <PaperPlane isActive={isActive} />
    </button>
    // </Rounded>
  );
});
