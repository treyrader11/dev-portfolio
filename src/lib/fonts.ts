import {
  Purple_Purse as FontPP,
  Cedarville_Cursive as FontCursive,
  // Monsieur_La_Doulaise as FontMono,
  Inter as FontInter,
  Syne_Mono as FontMono,
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

export const fontInter = FontInter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const fontMono = FontMono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mono",
});

// const fontMeueMontreal = {
//   src: "../public/fonts/NeueMontreal_Medium.otf",
//   variable: "--font-meue-montreal"
// }
