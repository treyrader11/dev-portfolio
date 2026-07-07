import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useFocusExpandContext } from "@/hooks/use-focus-expand";

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
  // Optional leading icon in the label (e.g. a social platform glyph).
  icon?: ReactNode;
  // Optional helper text under the control.
  hint?: string;
};

export function AdminInput({
  label,
  required,
  value,
  onChange,
  fieldClassName,
  className,
  icon,
  hint,
  ...rest
}: InputProps) {
  const id = useId();
  const focus = useFocusExpandContext();
  const focused = focus?.isFocused(id) ?? false;
  const dimmed = focus?.isDimmed(id) ?? false;
  const fp = focus?.getFocusProps(id);
  return (
    <FieldFrame
      label={label}
      required={required}
      icon={icon}
      hint={hint}
      focused={focused}
      dimmed={dimmed}
      className={fieldClassName}
    >
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={fp?.onFocus}
        onBlur={fp?.onBlur}
        className={cn(
          ADMIN_FIELD_CONTROL,
          focused && "ring-1 ring-secondary/50",
          className,
        )}
      />
    </FieldFrame>
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
  placeholder,
}: TextareaProps) {
  const id = useId();
  const focus = useFocusExpandContext();
  const focused = focus?.isFocused(id) ?? false;
  const dimmed = focus?.isDimmed(id) ?? false;
  const fp = focus?.getFocusProps(id);
  return (
    <FieldFrame
      label={label}
      required={required}
      focused={focused}
      dimmed={dimmed}
      className={fieldClassName}
    >
      <ExpandingTextarea
        value={value}
        focused={focused}
        placeholder={placeholder}
        fieldRef={() => {}}
        onChange={(e) => onChange(e.target.value)}
        onFocus={fp?.onFocus}
        onBlur={() => fp?.onBlur()}
      />
    </FieldFrame>
  );
}

/* ------------------------------------------------------------------ *
 * react-hook-form–wired fields (single column, full width, focus-expand).
 * These read their value/error from the surrounding <AdminForm> context by
 * `name`, and auto-participate in the shared focus-expand UX. Prefer these for
 * new admin forms; the plain AdminInput/AdminTextarea above stay for callers
 * that manage their own state.
 * ------------------------------------------------------------------ */

// Shared control styling for the RHF fields: full width, dark surface, and a
// secondary focus ring.
export const ADMIN_FIELD_CONTROL =
  "w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white placeholder:text-light-400 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-secondary";

interface AdminFieldControlProps {
  // react-hook-form field name.
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  // Helper text rendered below the control.
  hint?: string;
  className?: string;
}

// Label + hint + error wrapper that also drives the focus-expand lift/dim.
function FieldFrame({
  label,
  required,
  icon,
  hint,
  error,
  focused,
  dimmed,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: ReactNode;
  hint?: string;
  error?: string;
  focused: boolean;
  dimmed: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "flex w-full flex-col gap-1",
        // Lift above the blur backdrop while focused; blur/dim when another
        // field is focused instead.
        focused && "relative z-50",
        dimmed && "opacity-50 blur-[2px]",
        className,
      )}
    >
      <label className="flex items-center gap-1.5 text-sm font-medium text-white">
        {icon && <span className="text-light-400">{icon}</span>}
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      </label>
      {children}
      {hint && <p className="text-xs text-light-400">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </motion.div>
  );
}

interface AdminTextFieldProps extends AdminFieldControlProps {
  type?: string;
}

export function AdminTextField({
  name,
  label,
  required,
  placeholder,
  hint,
  className,
  type = "text",
}: AdminTextFieldProps) {
  const { control } = useFormContext();
  const focus = useFocusExpandContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const focused = focus?.isFocused(name) ?? false;
        const dimmed = focus?.isDimmed(name) ?? false;
        const fp = focus?.getFocusProps(name);
        return (
          <FieldFrame
            label={label}
            required={required}
            hint={hint}
            error={fieldState.error?.message}
            focused={focused}
            dimmed={dimmed}
            className={className}
          >
            <input
              type={type}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              placeholder={placeholder}
              onChange={field.onChange}
              onFocus={fp?.onFocus}
              onBlur={() => {
                field.onBlur();
                fp?.onBlur();
              }}
              className={cn(
                ADMIN_FIELD_CONTROL,
                focused && "ring-1 ring-secondary/50",
              )}
            />
          </FieldFrame>
        );
      }}
    />
  );
}

// The textarea grows to fit its content while focused and collapses to a single
// clipped line when blurred — the focus-expand behavior from the tasks list,
// now reusable for any multiline field.
function ExpandingTextarea({
  value,
  focused,
  placeholder,
  fieldRef,
  onChange,
  onFocus,
  onBlur,
}: {
  value: string;
  focused: boolean;
  placeholder?: string;
  fieldRef: (el: HTMLTextAreaElement | null) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (focused) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = "";
    }
  }, [focused, value]);
  return (
    <textarea
      ref={(el) => {
        ref.current = el;
        fieldRef(el);
      }}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        ADMIN_FIELD_CONTROL,
        "resize-none",
        focused
          ? "whitespace-pre-wrap break-words ring-1 ring-secondary/50"
          : "h-9 overflow-hidden whitespace-nowrap",
      )}
    />
  );
}

export function AdminTextareaField({
  name,
  label,
  required,
  placeholder,
  hint,
  className,
}: AdminFieldControlProps) {
  const { control } = useFormContext();
  const focus = useFocusExpandContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const focused = focus?.isFocused(name) ?? false;
        const dimmed = focus?.isDimmed(name) ?? false;
        const fp = focus?.getFocusProps(name);
        return (
          <FieldFrame
            label={label}
            required={required}
            hint={hint}
            error={fieldState.error?.message}
            focused={focused}
            dimmed={dimmed}
            className={className}
          >
            <ExpandingTextarea
              value={field.value ?? ""}
              focused={focused}
              placeholder={placeholder}
              fieldRef={field.ref}
              onChange={field.onChange}
              onFocus={fp?.onFocus}
              onBlur={() => {
                field.onBlur();
                fp?.onBlur();
              }}
            />
          </FieldFrame>
        );
      }}
    />
  );
}

interface AdminSelectFieldProps extends AdminFieldControlProps {
  options: { label: string; value: string }[];
}

export function AdminSelectField({
  name,
  label,
  required,
  placeholder,
  hint,
  className,
  options,
}: AdminSelectFieldProps) {
  const { control } = useFormContext();
  const focus = useFocusExpandContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const focused = focus?.isFocused(name) ?? false;
        const dimmed = focus?.isDimmed(name) ?? false;
        const fp = focus?.getFocusProps(name);
        return (
          <FieldFrame
            label={label}
            required={required}
            hint={hint}
            error={fieldState.error?.message}
            focused={focused}
            dimmed={dimmed}
            className={className}
          >
            <select
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onFocus={fp?.onFocus}
              onBlur={() => {
                field.onBlur();
                fp?.onBlur();
              }}
              className={cn(
                ADMIN_FIELD_CONTROL,
                focused && "ring-1 ring-secondary/50",
              )}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldFrame>
        );
      }}
    />
  );
}

type AdminCheckboxFieldProps = Omit<
  AdminFieldControlProps,
  "placeholder" | "required"
>;

export function AdminCheckboxField({
  name,
  label,
  hint,
  className,
}: AdminCheckboxFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("flex w-full flex-col gap-1", className)}>
          <label className="flex items-center gap-2 text-sm font-medium text-white">
            <input
              type="checkbox"
              ref={field.ref}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              className="size-4 accent-secondary"
            />
            {label}
          </label>
          {hint && <p className="text-xs text-light-400">{hint}</p>}
        </div>
      )}
    />
  );
}
