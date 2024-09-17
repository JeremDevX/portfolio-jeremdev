import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/cv_jeremdevx.pdf"],
    },
    sitemap: "https://jeremdevx.com/sitemap.xml",
  };
}
