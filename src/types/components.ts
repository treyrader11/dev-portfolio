import type { ReactNode, InputHTMLAttributes } from "react";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
}

export interface ScrollPosition {
  positionId: number;
  name: string;
}

export interface Route {
  label: string;
  href: string;
}
