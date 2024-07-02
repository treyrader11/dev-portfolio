"use client";

import { cn, validateEmail } from "@/lib/utils";
import Input from "@/components/Input";
import { VscSend } from "react-icons/vsc";
import { useRef, forwardRef, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa6";
import gsap from "gsap";
import PaperPlane from "../PaperPlane";
import { getPlaneKeyframes } from "../../getPlaneKeyframes";
import { getTrailsKeyframes } from "../../getTrailsKeyframes";
import SubmitEmail from "../SubmitEmail";
import axios from "axios";

const initValues = { name: "", email: "", subject: "", message: "" };

const initState = { isLoading: false, error: "", values: initValues };

export default function ContactForm({ className }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState(initState);
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef(null);
  const { to, fromTo, set } = gsap;

  const { values, isLoading, error } = state;

  const onBlur = ({ target }) =>
    setTouched((prev) => ({ ...prev, [target.name]: true }));

  const handleChange = ({ target }) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, subject, message } = values;

    console.log("email in handle submit", email);
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
          setInput,
          setState,
          initState
        ),
      });

      to(button, { keyframes: getTrailsKeyframes(button) });
    }

    try {
      const res = await axios.post("/api/email", {
        name,
        email,
        subject,
        message,
      });

      console.log("Response from API:", res);

      if (res.status !== 200) {
        console.error("Error response from API:", res.data);
        setErrorMessage(`Something went wrong! Details: "${res.data.error}"`);
        setSuccessMessage(undefined);
        return;
      }

      console.log("Successful response from API:", res.data);

      setSuccessMessage("Email successfully sent");
      setErrorMessage(undefined);
    } catch (error) {
      console.error("Error making API request:", error);
      setErrorMessage(`Something went wrong! Details: "${error.message}"`);
      setSuccessMessage(undefined);
    }
  };

  const dismissMessages = () => {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "contact-form",
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
            type="text"
            placeholder="Your name"
            name="name"
            // errorBorderColor="red.300"
            value={values.name}
            onChange={handleChange}
            onBlur={onBlur}
          />

          <Input
            type="email"
            placeholder="Email address"
            name="email"
            // errorBorderColor="red.300"
            value={values.email}
            onChange={handleChange}
            onBlur={onBlur}
          />
        </div>
        <Input
          placeholder="Subject"
          type="text"
          name="subject"
          // errorBorderColor="red.300"
          value={values.subject}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <textarea
          cols={36}
          rows={6}
          name="message"
          placeholder="Message"
          className={cn(
            "w-full",
            "py-4",
            "px-6",
            "rounded-[30px]",
            "resize-none",
            "focus:outline-secondary",
            "transition-all",
            "duration-300",
            "ease-in-out",
            "bg-slate-100",
            "text-black"
          )}
          type="text"
          // errorBorderColor="red.300"
          value={values.message}
          onChange={handleChange}
          onBlur={onBlur}
        />

        <Submit
          isLoading={isLoading}
          disabled={
            !values.name || !values.email || !values.subject || !values.message
          }
          ref={buttonRef}
          input={input}
          isActive={isActive}
        />
      </form>

      <div className="relative">
        {(successMessage || errorMessage) && (
          <div
            className={cn(
              "absolute",
              "w-full",
              "flex",
              "justify-center",
              "items-center",
              "gap-x-2",
              "bg-[#0A0E12]",
              "text-white",
              "py-4",
              "px-6",
              "animate-fade-bottom"
            )}
          >
            <ResponseIcon
              isSuccess={successMessage ? true : false}
              className={cn({
                "bg-[#1B2926] border-[#273130]": successMessage,
              })}
            />
            <div className="text-xs sm:text-sm text-[#4B4C52]">
              <p>{successMessage ? successMessage : errorMessage}</p>
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

const Submit = forwardRef(({ isActive, disabled }, ref) => {
  return (
    <button
      style={{ WebkitTapHighlightColor: "transparent" }}
      ref={ref}
      className={cn(
        { active: isActive },
        disabled &&
          cn("disabled:grayscale-[65%]", "disabled:cursor-not-allowed"),
        "text-sm",
        "md:text-base",
        "relative",
        "py-2",
        "min-4-[100px]",
        "text-center",
        "text-white",
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
      // disabled={!input}
      // disabled={disabled}
      type="submit"
    >
      <span
        className={cn("relative", "z-[4]", "flex", "items-center", "gap-2", {
          "opacity-0": isActive,
        })}
      >
        Send <VscSend />
      </span>
      <span
        className={cn(
          // ".success" determines animation/transform
          "success",
          "text-emerald-500",
          "z-0",
          "absolute",
          "inset-x-0",
          "top-2",
          "-translate-x-3",
          "flex",
          "justify-center",
          "items-center",
          "opacity-0",
          {
            "opacity-100 [transform:translateX(-3px)_translateZ(0)]": isActive,
          }
        )}
      >
        <svg
          // check mark
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={14}
          className={cn(
            "stroke-2",
            "w-6",
            "stroke-emerald-500",
            "pointer-events-none"
          )}
          viewBox="0 0 16 16"
        >
          <polyline points="3.75 9 7 12 13 5" />
        </svg>
        Sent
      </span>
      <PaperPlane isActive={isActive} />
    </button>
  );
});

Submit.displayName = "Submit";

function ResponseIcon({ isSuccess = false, className }) {
  return (
    <div
      className={cn(
        "size-10",
        "flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "border-red-600",
        "flex-shrink-0",
        className
      )}
    >
      {isSuccess ? (
        <FaCheck className="size-4 text-emerald-300" />
      ) : (
        <FaExclamation className="text-red-600 size-4" />
      )}
    </div>
  );
}
