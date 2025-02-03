// "use client";

import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";
import { FlipWords } from "@/components/ui/flip-word";
import { ProjectTabs } from "@/components/custom/ProjectTabs/ProjectTabs";
import { motion } from "framer-motion";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

export default function Home() {
  const t = useTranslations("Home");
  const words = ["React", "Next.js", "TypeScript", "Tailwind", "Sass"];
  // const bars = Array.from({ length: 10 }, (_, i) => ({
  //   delay: Math.random() * 3,
  //   height: `${Math.random() * 20}%`,
  //   position: `${Math.random() * 100}%`,
  //   duration: Math.random() * 6,
  // }));
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
        <AnimatedTechs skills="secondary" />
      </section>
      <section className={styles.projects}>
        <h2 className={styles.projects__title}>{t("myProjects")}</h2>
        <ProjectTabs />
      </section>
      <div className={styles.grid}>
        {/* {bars.map((bar, index) => (
          <motion.div
            key={index}
            className={styles.movingBar}
            initial={{ bottom: "0%" }}
            animate={{ bottom: "100%" }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
            style={{ left: "50%" }}
          />
        ))} */}
      </div>
    </main>
  );
}
