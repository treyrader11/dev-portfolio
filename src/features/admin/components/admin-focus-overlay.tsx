import { AnimatePresence, motion } from "framer-motion";

// The blurred backdrop for the focus-expand UX. Rendered once (via <AdminForm>)
// per admin form; fades in whenever any field is focused. pointer-events-none so
// clicking the dimmed area still blurs the active field naturally.
export function AdminFocusOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}
    </AnimatePresence>
  );
}
