import styles from "./page.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";
import { FlipWords } from "@/components/ui/flip-word";
import CarouselHome from "@/components/ui/carousel-home";
import { TabsDemo } from "@/components/ui/tabsdemo";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

export default function Home() {
  const t = useTranslations("Home");
  const words = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
    "Sass",
    "Node.js",
    "Figma",
    "GitHub",
  ];

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.hero__content}>
          <h2>{t("title")}</h2>
          <p>
            {t.rich("text", {
              span: (richText) => (
                <strong className="accent bold">{richText}</strong>
              ),
            })}
          </p>
        </div>
        <div className={styles.hero__imgContainer}>
          <FlipWords words={words} />
        </div>
      </section>
      <section className={styles.skills}>
        <h2 className={styles.skills__title}>{t("mySkills")}</h2>
        <h3 className={styles.skills__subtitle}>{t("mainSkills")}</h3>
        <AnimatedTechs skills="main" />
        <h3 className={styles.skills__subtitle}>{t("secondarySkills")}</h3>
        <AnimatedTechs skills="secondary" />
      </section>
      <section className={styles.projects}>
        <h2 className={styles.skills__title}>{t("myProjects")}</h2>
        <TabsDemo />
      </section>
      <div className={styles.hero__grid}></div>
    </main>
  );
}
