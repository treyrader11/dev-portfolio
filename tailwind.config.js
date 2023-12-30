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
          DEFAULT: "#141516",
          400: "#1c1d20",
          500: "#141516",
          600: "#292929",
          700: "#292929",
        },
        light: {
          100: "#999999",
          200: "#888888",
          300: "#868686",
        },
      },
      transitionTimingFunction: {
        "custom-ease-in-out": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      theme: {
        boxShadow: {
          "custom-shadow": "0px 60px 50px rgba(0, 0, 0, 0.748)",
        },
      },
    },
  },
  plugins: [],
};
