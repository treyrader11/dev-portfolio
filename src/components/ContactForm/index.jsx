import { cn } from "@/lib/utils";
import Address from "../Address";
import { userData } from "@/lib/data";
import PageTitle from "@/common/PageTitle";
import Image from "next/image";
import Input from "@/common/Input";
import Rounded from "@/common/Rounded";
import Button from "@/common/Button";

export default function ContactForm() {
  return (
    <section className="bg-dark">
      <PageTitle title="Contact" />
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
            <header>
              <h1 className="text-2xl font-semibold text-gray-50">
                Let&apos;s talk.
              </h1>
              <p className="mt-2 text-base font-light text-gray-200">
                Fill in the details and I&apos;ll get back to you as soon as I
                can.
              </p>
            </header>
            <div className="inline-flex flex-col my-20 icons-container">
              <div
                className={cn(
                  "flex",
                  "flex-row",
                  "items-center",
                  "space-x-6",
                  "rounded-md",
                  "border",
                  "˝border-[#02044A]",
                  "hover:border",
                  "hover:border-purple-500",
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
              <div
                className={cn(
                  "flex",
                  "flex-row",
                  "items-center",
                  "space-x-6",
                  "rounded-md",
                  "border",
                  "border-[#02044A]",
                  "hover:border",
                  "hover:border-purple-500",
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
              </div>
              <Address
                className={cn(
                  "border",
                  "border-[#02044A]",
                  "hover:border",
                  "hover:border-purple-500"
                )}
              />
            </div>
            <div className="flex flex-row space-x-2 social-icons">
              <Rounded
                className={cn(
                  "size-10",
                  "rounded-full",
                  "hover:bg-purple-500",
                  "flex",
                  "items-center",
                  "justify-center",
                  "cursor-pointer"
                )}
                href={userData.socialLinks.facebook}
              >
                <svg
                  width="24"
                  height="24"
                  className="text-gray-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                    fill="currentColor"
                  />
                </svg>
              </Rounded>

              <Rounded
                href={userData.socialLinks.twitter}
                className={cn(
                  "flex",
                  "items-center",
                  "justify-center",
                  "rounded-full",
                  "cursor-pointer",
                  "size-10",
                  "hover:bg-purple-500"
                )}
              >
                <svg
                  width="24"
                  height="24"
                  className="text-gray-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 3C9.10457 3 10 3.89543 10 5V8H16C17.1046 8 18 8.89543 18 10C18 11.1046 17.1046 12 16 12H10V14C10 15.6569 11.3431 17 13 17H16C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21H13C9.13401 21 6 17.866 6 14V5C6 3.89543 6.89543 3 8 3Z"
                    fill="currentColor"
                  />
                </svg>
              </Rounded>
              <Rounded
                href={userData.socialLinks.instagram}
                className={cn(
                  "flex",
                  "items-center",
                  "justify-center",
                  "size-10",
                  "rounded-full",
                  "cursor-pointer",
                  "hover:bg-purple-500"
                )}
              >
                <svg
                  width="24"
                  height="24"
                  className="text-gray-50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 1C2.79086 1 1 2.79086 1 5V19C1 21.2091 2.79086 23 5 23H19C21.2091 23 23 21.2091 23 19V5C23 2.79086 21.2091 1 19 1H5ZM19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    fill="currentColor"
                  />
                </svg>
              </Rounded>
            </div>
          </div>

          <div className={cn("flex gap-8 mt-[3.rem] flex-col")}>
            <div className={cn("w-2/5 relative")}>
              <Image
                src={`/images/map.png`}
                alt="image of map"
                width={100}
                height={100}
                className="w-full object-cover opacity-[0.1]"
              />
            </div>
            <form action="" className={cn(" flex flex-col gap-[1.2rem]")}>
              <div className={cn("flex gap-4")}>
                <Input type="text" placeholder="Your name" />
                <Input type="email" placeholder="Email address" />
              </div>
              <div className="input-control">
                <Input type="text" placeholder="Subject" />
              </div>
              <div className="input-control">
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
                    "bg-dark-400",
                    "focus:outline-purple-400",
                    "outline-[1px]",
                    "transition-all",
                    "duration-300",
                    "ease-in-out",
                    "bg-white",
                    "text-white"
                  )}
                ></textarea>
              </div>
              {/* <div className="btn-con"> */}
              <Rounded>Send</Rounded>
              {/* </div> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
