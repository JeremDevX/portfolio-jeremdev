import styles from "./page.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.hero__content}>
          <h1>
            JeremDev<span className="accent">X</span>
          </h1>

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
          <Image
            src="/photo-hero.png"
            alt="Avatar de JeremDevX"
            width={350}
            height={350}
            className={styles.hero__img}
            priority
          />
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
        <h2>{t("myProjects")}</h2>
        {/* <CarouselHome /> */}
      </section>
    </main>
  );
}
