import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Shared control styling for admin form inputs.
export const ADMIN_CONTROL =
  "w-full px-3 py-2 border border-dark-600 rounded-lg text-sm";

interface FieldProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

// Labeled field wrapper for admin forms: a single-line title above the control
// with an optional required asterisk, and a full-width control below.
export function AdminField({
  label,
  required,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  fieldClassName?: string;
};

export function AdminInput({
  label,
  required,
  value,
  onChange,
  fieldClassName,
  className,
  ...rest
}: InputProps) {
  return (
    <AdminField label={label} required={required} className={fieldClassName}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(ADMIN_CONTROL, className)}
        {...rest}
      />
    </AdminField>
  );
}

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> & {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  fieldClassName?: string;
};

export function AdminTextarea({
  label,
  required,
  value,
  onChange,
  fieldClassName,
  className,
  ...rest
}: TextareaProps) {
  return (
    <AdminField label={label} required={required} className={fieldClassName}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(ADMIN_CONTROL, className)}
        {...rest}
      />
    </AdminField>
  );
}
