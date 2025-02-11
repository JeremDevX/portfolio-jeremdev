import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";
import { FlipWords } from "@/components/ui/flip-word";
import { ProjectTabs } from "@/components/custom/ProjectTabs/ProjectTabs";
import Grid from "@/components/custom/Grid/Grid";
import AboutDropdown from "@/components/custom/AboutDropdown/AboutDropdown";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: t("home.title"),
    description: t("home.description"),
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
        <AnimatedTechs skills="secondary" />
      </section>
      <section className={styles.projects}>
        <h2 className={styles.projects__title}>{t("myProjects")}</h2>
        <ProjectTabs />
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
      <Grid />
    </main>
  );
}
