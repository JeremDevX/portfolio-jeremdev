import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import { getTranslations, getLocale } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";
import { FlipWords } from "@/components/ui/flip-word";
import GridWrapper from "@/components/custom/Grid/GridWrapper";
import AboutDropdown from "@/components/custom/AboutDropdown/AboutDropdown";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import GithubContributions from "@/components/custom/GithubData/GithubContributions/GithubContributions";
import GitHubProjectsFetcher from "@/components/custom/GithubData/GitHubProjects/GitHubProjectsFetcher";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData");
  const locale = await getLocale();
  const { baseUrl } = SITE_CONFIG;

  return {
    title: t("home.title"),
    description: t("home.description"),
    keywords: [
      "développeur",
      "front-end",
      "React",
      "Next.js",
      "TypeScript",
      "portfolio",
      "Jérémie Lavergnat",
      "web developer",
      "freelance",
    ],
    authors: [{ name: "Jérémie Lavergnat", url: baseUrl }],
    creator: "Jérémie Lavergnat",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      url: `${baseUrl}/${locale}`,
      siteName: "Jérémie Lavergnat - Portfolio",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Jérémie Lavergnat - Développeur React & Next.js",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("home.title"),
      description: t("home.description"),
      creator: "@JeremDevX",
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
type AboutContentItem = {
  title: string;
  content: string;
};

export default function Home() {
  const t = useTranslations("Home");
  const aboutContent: AboutContentItem[] = t.raw("aboutContent");

  const words = ["React", "Next.js", "TypeScript", "Node.js"];
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.hero__content}>
          <h2 className={styles.hero__title}>{t("title")}</h2>
          <p className={styles.hero__text}>
            {t.rich("text", {
              span: (richText) => (
                <strong className="accent bold">{richText}</strong>
              ),
              br: () => <br />,
            })}
          </p>
        </div>
        <div className={styles.hero__wordsContainer}>
          <FlipWords words={words} />
        </div>
      </section>
      <section className={styles.skills}>
        <h2 className={styles.skills__title}>{t("mySkills")}</h2>
        <h3 className={styles.skills__subtitle}>{t("mainSkills")}</h3>
        <AnimatedTechs skills="main" />
        <h3 className={styles.skills__subtitle}>{t("secondarySkills")}</h3>
        <AnimatedTechs skills="secondary" reverseAnimation delay />
      </section>
      <section className={styles.projects}>
        <h2 className={styles.projects__title}>{t("myProjects")}</h2>
        <GitHubProjectsFetcher />
        <GithubContributions />
      </section>
      <section className={styles.about}>
        <h2 className={styles.about__title}>{t("about")}</h2>
        {aboutContent.map((content, index) => (
          <AboutDropdown
            key={index}
            title={content.title}
            content={content.content}
            index={index}
          />
        ))}
      </section>
      <section className={styles.contact}>
        <h2 className={styles.contact__title}>Contact</h2>
        <p className={styles.contact__desc}>{t("contact")}</p>
        <div className={styles.contact__links}>
          <Link
            href={"https://www.linkedin.com/in/jeremie-lavergnat"}
            className={styles.contact__link}
          >
            <FaLinkedin className={styles.contact__icon} />
            LinkedIn
          </Link>
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            className={styles.contact__link}
          >
            <IoIosMail className={styles.contact__icon} />
            E-mail
          </Link>
        </div>
      </section>
      <footer className={styles.footer}>
        © Jérémie Lavergnat - {new Date().getFullYear()}
      </footer>
      <GridWrapper />
    </main>
  );
}
