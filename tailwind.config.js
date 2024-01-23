/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0f0f0f",
          400: "#1c1d20",
          500: "#141516",
          600: "#292929",
        },
        light: {
          100: "#999999",
          200: "#888888",
          300: "#868686",
          400: "#afa18f",
        },
      },
      transitionTimingFunction: {
        "custom-ease-in-out": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      boxShadow: {
        "custom-shadow": "0px 60px 50px rgba(0, 0, 0, 0.748)",
      },
      rotate: {
        "full": "360deg",
      }
    },
  },
  plugins: [],
};
