"use client";

import styles from "./ProjectTabs.module.scss";
import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";
import { SiNextdotjs, SiSanity, SiTypescript } from "react-icons/si";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { FaSass } from "react-icons/fa";

interface ContentContainerProps {
  title: string;
  image: string;
  description: string | React.ReactNode;
  techs: React.ReactNode[];
  sitePreview: string;
  githubRepo?: string;
  isActive: boolean;
}

export function ProjectTabs() {
  const t = useTranslations("Projects");
  const [activeTab, setActiveTab] = useState<string>("blogTools");
  const tabs = [
    {
      title: "Blog and Devtools",
      value: "blogTools",
      content: (
        <Container>
          <ContentContainer
            title={t("blog.title")}
            image={"/blog_devtools.png"}
            description={t.rich("blog.description", {
              br: () => <span className={styles.break} />,
            })}
            techs={[
              <SiNextdotjs key={"next" + t("blog.title")} />,
              <SiTypescript key={"ts" + t("blog.title")} />,
              <FaSass key={"sass" + t("blog.title")} />,
              <SiSanity key={"sanity" + t("blog.title")} />,
            ]}
            sitePreview="https://jeremdev-blog.vercel.app/"
            githubRepo="https://github.com/JeremDevX/jeremdev-blog"
            isActive={activeTab === "blogTools"}
          />
        </Container>
      ),
    },
    {
      title: "Personnal Finance",
      value: "personnalFinance",
      content: (
        <Container>
          <ContentContainer
            title={t("finance.title")}
            image={"/finance_app.png"}
            description={t.rich("finance.description", {
              br: () => <span className={styles.break} />,
            })}
            techs={[
              <SiNextdotjs key={"next" + t("finance.title")} />,
              <SiTypescript key={"ts" + t("finance.title")} />,
              <FaSass key={"sass" + t("finance.title")} />,
            ]}
            sitePreview="https://github.com/JeremDevX/personnal-finance-app"
            githubRepo="https://github.com/JeremDevX/personnal-finance-app"
            isActive={activeTab === "personnalFinance"}
          />
        </Container>
      ),
    },
    {
      title: "GitHub Search",
      value: "github",
      content: (
        <Container>
          <ContentContainer
            title={t("gus.title")}
            image={"/github_user_search.png"}
            description={t.rich("gus.description", {
              br: () => <span className={styles.break} />,
            })}
            techs={[
              <SiNextdotjs key={"next" + t("gus.title")} />,
              <SiTypescript key={"ts" + t("gus.title")} />,
              <FaSass key={"sass" + t("gus.title")} />,
            ]}
            sitePreview="https://jeremdevx-fm-challenge-github-user-search.vercel.app"
            githubRepo="https://github.com/JeremDevX/fm-challenge-github-user-search"
            isActive={activeTab === "github"}
          />
        </Container>
      ),
    },
    // {
    //   title: "Content",
    //   value: "content",
    //   content: (
    //     <Container>
    //       <ContentContainer
    //         title={t("gus.title")}
    //         image={"/github_user_search.png"}
    //         description={t.rich("gus.description", {
    //           br: () => <span className={styles.break} />,
    //         })}
    //         techs={["Next.js", "TypeScript", "Sass"]}
    //         sitePreview="https://jeremdevx-fm-challenge-github-user-search.vercel.app"
    //         githubRepo="https://github.com/JeremDevX/fm-challenge-github-user-search"
    //       />
    //     </Container>
    //   ),
    // },
  ];

  return (
    <div className="h-[50rem] min-[1024px]:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-4xl mx-auto w-full items-start justify-start mb-50">
      <Tabs tabs={tabs} setActiveTab={setActiveTab} />
    </div>
  );
}

const ContentContainer = (props: ContentContainerProps) => {
  const {
    title,
    image,
    description,
    techs,
    sitePreview,
    githubRepo,
    isActive,
  } = props;
  return (
    <>
      <div className={styles.dots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <h2 className={styles.container__title}>{title}</h2>
      <div className={styles.contentContainer}>
        <Image
          src={image}
          alt={`Preview of ${title}`}
          width={1000}
          height={1000}
          className={styles.contentContainer__image}
        />
        <div className={styles.contentContainer__content}>
          <p className={styles.contentContainer__content_text}>{description}</p>
          <div className={styles.contentContainer__techs}>
            <span className={styles.contentContainer__techs_text}>
              Made with
            </span>
            <ul className={styles.contentContainer__techs_list}>
              {techs.map((tech, i) => (
                <li key={i} className={styles.contentContainer__techs_item}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.container__links}>
          <Link
            href={sitePreview}
            className={styles.container__link}
            target="_blank"
            tabIndex={isActive ? 0 : -1}
            rel="noopener noreferrer nofollow"
          >
            Site Preview
          </Link>
          {githubRepo ? (
            <Link
              href={githubRepo}
              className={styles.container__link}
              target="_blank"
              tabIndex={isActive ? 0 : -1}
              rel="noopener noreferrer nofollow"
            >
              GitHub Repo
            </Link>
          ) : (
            <p className={styles.container__link}>Private repo</p>
          )}
        </div>
      </div>
      <div className={`${styles.container__links_desktop}`}>
        <Link
          href={sitePreview}
          className={styles.container__link}
          target="_blank"
          tabIndex={isActive ? 0 : -1}
          rel="noopener noreferrer nofollow"
        >
          Site Preview
        </Link>
        {githubRepo ? (
          <Link
            href={githubRepo}
            className={styles.container__link}
            target="_blank"
            tabIndex={isActive ? 0 : -1}
            rel="noopener noreferrer nofollow"
          >
            GitHub Repo
          </Link>
        ) : (
          <p className={styles.container__link}>Private repo</p>
        )}
      </div>
    </>
  );
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full text-center overflow-hidden relative h-full rounded-2xl p-4 md:p-6 text-xl md:text-4xl font-bold bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-[rgba(21,174,0,0.25)]">
      {children}
    </div>
  );
};
