import localFont from "next/font/local";

export const ppMuseum = localFont({
  variable: "--font-museum",
  display: "block",
  src: [
    {
      path: "./PPMuseum-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./PPMuseum-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./PPMuseum-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./PPMuseum-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./PPMuseum-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./PPMuseum-UltraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
});
