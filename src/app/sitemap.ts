import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_CONFIG } from "@/lib/constants";
import { buildSitemap } from "@/lib/seo";

export default function Sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(SITE_CONFIG.baseUrl, routing.locales);
}
