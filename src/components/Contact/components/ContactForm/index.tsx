"use client";

import { cn } from "@/lib/utils";
import Input from "@/components/Input";
import { VscSend } from "react-icons/vsc";
import { useRef, forwardRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa6";
import gsap from "gsap";
import PaperPlane from "../PaperPlane";
import { getPlaneKeyframes } from "../../getPlaneKeyframes";
import { getTrailsKeyframes } from "../../getTrailsKeyframes";
import ReCAPTCHA from "react-google-recaptcha";
import axios, { type AxiosError } from "axios";

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormState {
  isLoading: boolean;
  error: string;
  values: FormValues;
}

const initValues: FormValues = { name: "", email: "", message: "" };

const initState: FormState = { isLoading: false, error: "", values: initValues };

interface Props {
  className?: string;
}

export default function ContactForm({ className }: Props) {
  const [state, setState] = useState<FormState>(initState);
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [isActive, setIsActive] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { to, fromTo, set } = gsap;

  const { values, isLoading } = state;

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const isFormValid =
    values.name && values.email && values.message && recaptchaToken;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, message } = values;
    const button = buttonRef.current;

    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }

    if (!name || !email || !message || !button) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    if (!isActive) {
      setIsActive(true);

      to(button, {
        keyframes: getPlaneKeyframes(
          set,
          fromTo,
          button,
          setIsActive,
          () => {},
          setState,
          initState
        ),
      });

      to(button, { keyframes: getTrailsKeyframes(button) });
    }

    try {
      const res = await axios.post("/api/contact", {
        name,
        email,
        message,
        recaptchaToken,
      });

      if (res.status !== 200) {
        setErrorMessage(
          res.data?.error || "Something went wrong. Please try again."
        );
        setSuccessMessage(undefined);
        return;
      }

      setSuccessMessage("Message sent! I'll get back to you soon.");
      setErrorMessage(undefined);
      setState(initState);
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const msg =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setSuccessMessage(undefined);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
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
            value={values.name}
            onChange={handleChange}

          />

          <Input
            type="email"
            placeholder="Email address"
            name="email"
            value={values.email}
            onChange={handleChange}

          />
        </div>
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
          value={values.message}
          onChange={handleChange}
        />

        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
        </div>

        <Submit
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
          ref={buttonRef}
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

interface SubmitProps {
  isActive: boolean;
  disabled: boolean;
  isLoading: boolean;
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>(
  function Submit({ isActive, disabled, isLoading }, ref) {
    return (
      <button
        style={{ WebkitTapHighlightColor: "transparent" }}
        ref={ref}
        className={cn(
          { active: isActive },
          disabled &&
            cn(
              "disabled:grayscale-[65%]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50"
            ),
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
        disabled={disabled}
        type="submit"
      >
        <span
          className={cn("relative", "z-[4]", "flex", "items-center", "gap-2", {
            "opacity-0": isActive,
          })}
        >
          {isLoading ? "Sending..." : "Send"} {!isLoading && <VscSend />}
        </span>
        <span
          className={cn(
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
  }
);

interface ResponseIconProps {
  isSuccess?: boolean;
  className?: string;
}

function ResponseIcon({ isSuccess = false, className }: ResponseIconProps) {
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
