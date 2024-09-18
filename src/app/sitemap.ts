import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getWorksSlugs() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"), "utf-8");
  const slugs = files.map((file) => {
    return file.replace(/\.md$/, "");
  });

  return slugs;
}

export default function Sitemap(): MetadataRoute.Sitemap {
  const slugs = getWorksSlugs();

  const staticRoutes = [
    {
      url: "https://jeremdevx.com/",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: "https://jeremdevx.com/works",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://jeremdevx.com/profile",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
  ];

  const dynamicRoutes = slugs.map((slug) => ({
    url: `https://jeremdevx.com/works/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
