import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getprojectsSlugs() {
  const files = fs.readdirSync(
    path.join(process.cwd(), "content/en/"),
    "utf-8"
  );
  const slugs = files
    .filter((fn: string) => fn.endsWith(".md"))
    .map((file) => {
      return file.replace(/\.md$/, "");
    });

  return slugs;
}

export default function Sitemap(): MetadataRoute.Sitemap {
  const slugs = getprojectsSlugs();

  const staticRoutes = [
    {
      url: "https://jeremdevx.com/",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: "https://jeremdevx.com/fr/projects",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://jeremdevx.com/fr/profile",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: "https://jeremdevx.com/en/projects",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: "https://jeremdevx.com/en/profile",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
  ];
  const frDynamicRoutes = slugs.map((slug) => ({
    url: `https://jeremdevx.com/fr/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const enDynamicRoutes = slugs.map((slug) => ({
    url: `https://jeremdevx.com/en/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...frDynamicRoutes, ...enDynamicRoutes];
}
