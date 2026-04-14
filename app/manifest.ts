import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Norevi",
    short_name: "Norevi",
    description: "Norevi — умный помощник для финансов, платежей и напоминаний",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F6F8F7",
    theme_color: "#176A71",
    lang: "ru",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
