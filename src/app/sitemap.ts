import type { MetadataRoute } from "next";
import { SITE_CONFIG, SEO_CONFIG } from "@/lib/constants";

export default function Sitemap(): MetadataRoute.Sitemap {
  const { baseUrl } = SITE_CONFIG;
  const { locales } = SEO_CONFIG;

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ]);

  // Route racine qui redirige vers la locale par défaut
  const rootRoute: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
  ];

  return [...rootRoute, ...staticRoutes];
}
