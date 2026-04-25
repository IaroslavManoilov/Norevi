import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.fullName,
    short_name: BRAND.shortName,
    description: BRAND.descriptionRu,
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
