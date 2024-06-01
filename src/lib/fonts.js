import {
  Purple_Purse as FontPP,
  Cedarville_Cursive as FontCursive,
} from "next/font/google";

export const fontPP = FontPP({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pp-acma",
});

export const fontCursive = FontCursive({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-cursive",
});

// const fontMeueMontreal = {
//   src: "../public/fonts/NeueMontreal_Medium.otf",
//   variable: "--font-meue-montreal"
// }
