// "use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function scrollTo(id) {
  if (id) {
    const element = document.getElementById(id);
    console.log("element:", element);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
}

export const getUnique = (items, value) => {
  return [...new Set(items.map((item) => item[value]))];
};
