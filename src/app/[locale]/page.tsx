import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AnimatedTechs } from "@/components/custom/AnimatedTechs/AnimatedTechs";
import { FlipWords } from "@/components/ui/flip-word";
import { ProjectTabs } from "@/components/custom/ProjectTabs/ProjectTabs";
import Grid from "@/components/custom/Grid/Grid";
import AboutDropdown from "@/components/custom/AboutDropdown/AboutDropdown";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import GithubContributions from "@/components/custom/GithubData/GithubContributions/GithubContributions";
import GithubLanguages from "@/components/custom/GithubData/GithubLanguages/GithubLanguages";
import GitHubProjects from "@/components/custom/GithubData/GitHubProjects/GitHubProjectsList";
import GitHubProjectsFetcher from "@/components/custom/GithubData/GitHubProjects/GitHubProjectsFetcher";

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
        <AnimatedTechs skills="secondary" reverseAnimation delay />
      </section>
      <section className={styles.projects}>
        <h2 className={styles.projects__title}>{t("myProjects")}</h2>
        {/* <ProjectTabs /> */}
        <GitHubProjectsFetcher />
        <GithubContributions />
      </section>
      {/* <section className={styles.github}>
        <h2 className={styles.github__title}>GitHub</h2>
      </section> */}
      {/* <GithubLanguages /> */}
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
      <Grid />
    </main>
  );
}
