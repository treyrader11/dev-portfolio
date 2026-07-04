import { AnimatePresence, motion } from "framer-motion";

// The blurred backdrop for the focus-expand UX. Rendered once (via <AdminForm>)
// per admin form; fades in whenever any field is focused. It captures pointer
// events (no pointer-events-none) so page elements behind it can't be clicked
// while a field is focused; clicking the backdrop itself closes the focus and
// dismisses the blur. The focused field sits above it (z-50) so it stays
// interactive.
export function AdminFocusOverlay({
  active,
  onClose,
}: {
  active: boolean;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}
    </AnimatePresence>
  );
}
