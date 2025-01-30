import matter from "gray-matter";
import { Link } from "@/i18n/routing";
import { ImCalendar } from "react-icons/im";
import fs from "fs";
import path from "path";
import Image from "next/image";
import { cookies } from "next/headers";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("MetaData");

  return {
    title: t("projects.title"),
    description: t("projects.description"),
  };
}

interface WorkIndexData {
  content: string[];
}

interface WorkData {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  minia: string;
}

const getWorkData = async (): Promise<WorkIndexData> => {
  const localeCookie = (await cookies()).get("NEXT_LOCALE");
  const actualLocale = localeCookie ? localeCookie.value : "fr";

  console.log(actualLocale);
  const files = fs.readdirSync(
    path.join(process.cwd(), `content/${actualLocale}`),
    "utf-8"
  );
  const projectslugs: string[] = files.filter((fn: string) =>
    fn.endsWith(".md")
  );

  const content = projectslugs.map((projectslug) => {
    const filePath = path.join(
      process.cwd(),
      `content/${actualLocale}`,
      projectslug
    );
    const rawContent: string = fs.readFileSync(filePath, { encoding: "utf-8" });
    return rawContent;
  });

  return { content };
};

export default async function Work(props: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("projects");

  const data = await getWorkData();
  const { content } = data;
  const workDatas = content.map((work) => matter(work).data as WorkData);

  // sort by date formated as 'DD/MM/YYYY'
  workDatas.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map((n) => parseInt(n));
    const [dayB, monthB, yearB] = b.date.split("/").map((n) => parseInt(n));
    if (yearA !== yearB) return yearB - yearA;
    if (monthA !== monthB) return monthB - monthA;
    return dayB - dayA;
  });

  return (
    <main className="projects">
      <h1>{t("title")}</h1>
      <div className="projects__list">
        {workDatas.map((work, i) => {
          return (
            <Link
              className="projects__container"
              href={`/projects/${work.slug}`}
              key={i}
            >
              <div className="projects__heading">
                <h2 className="projects__title">{work.title}</h2>
                <div className="projects__date">
                  <ImCalendar className="projects__date-icon" />
                  <div className="projects__date-value">{work.date}</div>
                </div>
              </div>
              <div className="projects__meta">
                {work.tags && (
                  <div className="projects__tags">
                    {work.tags.map((tag, key) => (
                      <div className="tag-item" key={tag + key}>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="projects__description">{work.description}</div>
              <Image
                src={work.minia}
                alt={work.title}
                width={400}
                height={350}
              />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
