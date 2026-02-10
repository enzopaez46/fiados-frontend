import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fiados App",
    short_name: "Fiados",
    description: "A Progressive Web App built with bananas",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-64x64.png",
        type: "image/png",
        sizes: "64x64",
      },
      {
        src: "/icon-500x500.png",
        type: "image/png",
        sizes: "500x500",
      },
    ],
  };
}
