import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ScrollPosition } from "@/types/components";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const scrollTo = (id: string): void => {
  if (id) {
    const el = document.getElementById(id);
    console.log("element:", el);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
};

export const getUnique = <T, K extends keyof T>(
  items: T[],
  value: K
): T[K][] => {
  return [...new Set(items.map((item) => item[value]))];
};

export const createScrollPositions = (
  positions: { title: string }[]
): ScrollPosition[] => {
  return positions.map((pos, index) => ({
    positionId: index + 1,
    name: pos.title,
  }));
};

export const getLocalTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const formattedHours = hours < 10 ? hours : hours.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm} CT`;
};

export const genRandomNumbers = (
  min: number,
  max: number,
  count: number
): number[] => {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
};

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export const hexToRgb = (hex: string): RgbColor | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(
    shorthandRegex,
    (_m: string, r: string, g: string, b: string) => {
      return r + r + g + g + b + b;
    }
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const calcRandomBlockDelay = (
  rowIndex: number,
  totalRows: number
): number => {
  const blockDelay = Math.random() * 0.5;
  const rowDelay = (totalRows - rowIndex - 1) * 0.05;
  return blockDelay + rowDelay;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
