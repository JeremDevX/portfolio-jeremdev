import type { MetadataRoute } from "next";

export default function Sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: "https://jeremdevx.com/",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];

  return [...staticRoutes];
}
