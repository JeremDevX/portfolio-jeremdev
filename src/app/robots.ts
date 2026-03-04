import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { buildRobots } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(SITE_CONFIG.baseUrl);
}
