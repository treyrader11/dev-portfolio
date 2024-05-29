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
        primary: {
          DEFAULT: "#ec4e39",
        },
        secondary: {
          DEFAULT: "#934E00",
        },
        dark: {
          DEFAULT: "#0f0f0f",
          400: "#1C1C1C",
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
        full: "360deg",
      },
      animation: {
        "slide-left": "slide-left 1.3s ease-in-out",
        "octocat-wave": "octocat-wave 0.56s",
        "slide-up": "slide-up 0.5s ease-out",
        dash: "dash 1.5s ease-in-out infinite",
        "rotate-gradient": "1.3s infinite ease-in-out",
      },
      keyframes: {
        "slide-left": {
          from: { opacity: 0, transform: "translateX(-500px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px) scale(0.9)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "octocat-wave": {
          "0%, 100%": {
            transform: "rotate(0)",
          },
          "20%, 60%": {
            transform: "rotate(-20deg)",
          },
          "40%, 80%": {
            transform: "rotate(10deg)",
          },
        },
        "rotate-gradient": {
          "0%": {
            "background-position": "0% 0%",
          },
          "100%": {
            "background-position": "100% 100%",
          },
        },
        dash: {
          "0%": {
            "stroke-dasharray": "1, 200",
            "stroke-dashoffset": 0,
          },
          "50%": {
            "stroke-dasharray": "89, 200",
            "stroke-dashoffset": "-35px",
          },
          "100%": {
            "stroke-dasharray": "89, 200",
            "stroke-dashoffset": "-124px",
          },
        },
      },
    },
  },
  plugins: [],
};
