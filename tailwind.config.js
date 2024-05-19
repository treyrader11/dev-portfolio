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
        full: "360deg",
      },
      animation: {
        slideright2: "slideright2 1.3s ease-in-out",
        "octocat-wave": "octocat-wave 0.56s",
      },
      keyframes: {
        slideleft2: {
          from: { opacity: 0, transform: "translateX(-500px)" },
          to: { opacity: 1, transform: "translateX(0)" },
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
      },
      // screens: {
      //   225: "225px",
      //   310: "310px",
      //   340: "340px",
      //   350: "350px",
      //   370: "370px",
      //   400: "400px",
      //   420: "420px",
      //   450: "450px",
      //   500: "500px",
      //   550: "550px",
      //   600: "600px",
      //   630: "630px",
      //   660: "660px",
      //   720: "720px",
      //   800: "800px",
      //   840: "840px",
      //   860: "860px",
      //   900: "900px",
      //   950: "950px",
      //   1000: "1000px",
      //   1140: "1140px",
      //   1250: "1250px",
      //   1260: "1260px",
      //   1280: "1280px",
      //   1300: "1300px",
      // },
    },
  },
  plugins: [],
};
