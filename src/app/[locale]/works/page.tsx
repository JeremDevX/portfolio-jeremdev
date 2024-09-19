import matter from "gray-matter";
import { Link } from "@/i18n/routing";
import { ImCalendar } from "react-icons/im";
import fs from "fs";
import path from "path";
import Image from "next/image";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "JeremDevX - Réalisations",
  description: "Liste de mes réalisations.",
};

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
  const localeCookie = cookies().get("NEXT_LOCALE");
  const actualLocale = localeCookie ? localeCookie.value : "fr";

  console.log(actualLocale);
  const files = fs.readdirSync(
    path.join(process.cwd(), `content/${actualLocale}`),
    "utf-8"
  );
  const workSlugs: string[] = files.filter((fn: string) => fn.endsWith(".md"));

  const content = workSlugs.map((workSlug) => {
    const filePath = path.join(
      process.cwd(),
      `content/${actualLocale}`,
      workSlug
    );
    const rawContent: string = fs.readFileSync(filePath, { encoding: "utf-8" });
    return rawContent;
  });

  return { content };
};

export default async function Work() {
  const t = await getTranslations("Works");

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
    <main className="works">
      <h1>{t("title")}</h1>
      <div className="works__list">
        {workDatas.map((work, i) => {
          return (
            <Link
              className="works__container"
              href={`/works/${work.slug}`}
              key={i}
            >
              <div className="works__heading">
                <h2 className="works__title">{work.title}</h2>
                <div className="works__date">
                  <ImCalendar className="works__date-icon" />
                  <div className="works__date-value">{work.date}</div>
                </div>
              </div>
              <div className="works__meta">
                {work.tags && (
                  <div className="works__tags">
                    {work.tags.map((tag, key) => (
                      <div className="tag-item" key={tag + key}>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="works__description">{work.description}</div>
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
