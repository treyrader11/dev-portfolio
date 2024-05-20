export const slideUp = {
  initial: {
    y: "100%",
    transition: { duration: 0.5, delay: 5 },
  },
  open: (i) => ({
    y: "-100%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};
