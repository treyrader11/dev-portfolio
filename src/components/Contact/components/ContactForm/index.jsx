import { cn } from "@/lib/utils";
import Address from "../../../Address";
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import Input from "@/components/Input";
import Rounded from "@/components/Rounded";
import Magnetic from "@/components/Magnetic";
import { userData } from "@/lib/data";
import { VscSend } from "react-icons/vsc";
import { VscCoffee } from "react-icons/vsc";
import Socials from "@/components/Socials";

const imageProps = {
  width: 100,
  height: 100,
  className: "w-full object-cover opacity-[0.1]",
  src: "/images/map.png",
};

export default function ContactForm() {
  return (
    <section className="bg-dark">
      <PageTitle title="Contact." />
      <div
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:ml-4">
            <header className="pt-10">
              <h1 className="flex items-center text-2xl font-semibold gap-x-2 text-gray-50">
                Let&apos;s talk. <VscCoffee className="text-3xl" />
              </h1>
              <p className="mt-2 text-base font-light text-gray-200">
                Fill in the details and I&apos;ll get back to you as soon as I
                can.
              </p>
            </header>
            <div className="inline-flex flex-col my-10">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-purple-500 size-4 bi bi-telephone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                  <p className="text-sm font-light text-gray-50">
                    {userData.phone}
                  </p>
                </div>
              </Magnetic>
              <Magnetic>
                <a
                  href={`mailto:${userData.email}`}
                  className={cn(
                    "flex",
                    "flex-row",
                    "items-center",
                    "space-x-6",
                    "rounded-md",
                    "p-4"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-purple-500 size-4 bi bi-envelope-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                  </svg>

                  <p className="text-sm font-light text-gray-50">
                    {userData.email}
                  </p>
                </a>
              </Magnetic>
              <Address />
            </div>
            <Socials rounded />
          </div>

          <div className={cn("flex gap-8 mt-[3.rem] flex-col")}>
            <div className="relative w-2/5">
              <Image {...imageProps} alt="image of map" />
            </div>
            <form action="" className={cn("flex flex-col gap-[1.2rem]")}>
              <div className="flex gap-4">
                <Input type="text" placeholder="Your name" />
                <Input type="email" placeholder="Email address" />
              </div>
              <Input type="text" placeholder="Subject" />
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

              <Rounded backgroundColor="#8550C2">
                <p className="flex relative z-[10] items-center gap-2">
                  Send <VscSend />
                </p>
              </Rounded>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
