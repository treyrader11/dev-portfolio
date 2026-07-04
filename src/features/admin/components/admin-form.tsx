import type { ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FocusExpandProvider,
  useFocusExpand,
} from "@/hooks/use-focus-expand";
import { AdminFocusOverlay } from "./admin-focus-overlay";

interface AdminFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

// Reusable admin form shell. Wires up react-hook-form's context, the shared
// focus-expand state (so any AdminField auto-participates), and the blur
// backdrop — then lays its children out in a single full-width column. Admin
// forms should never use grid-cols-*; every field is full width, top to bottom.
export function AdminForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: AdminFormProps<T>) {
  const focus = useFocusExpand();

  return (
    <FocusExpandProvider value={focus}>
      <AdminFocusOverlay
        active={focus.focusedId !== null}
        onClose={() => focus.setFocusedId(null)}
      />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex w-full flex-col gap-4", className)}
        >
          {children}
        </form>
      </FormProvider>
    </FocusExpandProvider>
  );
}

// Focus-expand + blur backdrop for admin forms that manage their own local state
// (no react-hook-form). Wrap the fields in this and any focus-aware
// AdminInput/AdminTextarea inside lifts above the blur when focused; clicking the
// backdrop closes it. Same UX as <AdminForm> without the RHF wiring.
export function AdminFocusScope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const focus = useFocusExpand();
  return (
    <FocusExpandProvider value={focus}>
      <AdminFocusOverlay
        active={focus.focusedId !== null}
        onClose={() => focus.setFocusedId(null)}
      />
      <div className={className}>{children}</div>
    </FocusExpandProvider>
  );
}
