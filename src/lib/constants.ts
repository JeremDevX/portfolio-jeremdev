/**
 * Constantes centralisées de l'application
 * Évite les duplications et facilite la maintenance
 */

// ==========================================
// INFORMATIONS PERSONNELLES
// ==========================================

export const PERSONAL_INFO = {
  name: "Jérémie Lavergnat",
  alternateName: "JeremDevX",
  jobTitle: "Front-End React / Next.js Developer",
  email: "jeremdev.contactpro@gmail.com",
  location: "Isère, France",
} as const;

// ==========================================
// URLS ET LIENS
// ==========================================

export const SITE_CONFIG = {
  baseUrl: "https://jeremdevx.com",
  siteName: "Jérémie Lavergnat - Portfolio",
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/JeremDevX",
  linkedin: "https://www.linkedin.com/in/jeremie-lavergnat",
  twitter: "https://x.com/JeremDevX",
  email: `mailto:${PERSONAL_INFO.email}`,
} as const;

// ==========================================
// GITHUB API
// ==========================================

export const GITHUB_CONFIG = {
  username: "jeremdevx",
  apiUrl: "https://api.github.com/graphql",
  revalidateTime: 3600, // 1 heure en secondes
} as const;

// ==========================================
// SEO
// ==========================================

export const SEO_CONFIG = {
  defaultLocale: "fr",
  locales: ["fr", "en"] as const,
  twitterHandle: "@JeremDevX",
} as const;

// ==========================================
// TECHNOLOGIES / SKILLS
// ==========================================

export const TECH_STACK = {
  main: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Sass",
    "HTML5",
    "CSS3",
  ],
  secondary: [
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "GitHub",
    "GitLab",
    "Sanity",
    "Strapi",
    "Python",
    "PHP",
  ],
} as const;
