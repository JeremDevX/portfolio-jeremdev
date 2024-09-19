import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { ImCalendar } from "react-icons/im";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CarouselProject from "@/components/ui/project-carousel";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { FaGithub } from "react-icons/fa";
import { cookies } from "next/headers";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

interface WorkData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  img: string[];
  repo: string;
}

const getLocaleCookie = () => {
  const localeCookie = cookies().get("NEXT_LOCALE");
  const actualLocale = localeCookie ? localeCookie.value : "fr";

  return actualLocale;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const actualLocale = getLocaleCookie();
  const { slug } = params;
  const filePath = path.join(
    process.cwd(),
    `content/${actualLocale}`,
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const { data: workData } = matter(rawContent);

  return {
    title: `JeremDevX - ${workData.title}`,
    description: workData.description || "Liste de mes réalisations.",
  };
}

function Heading(props: any) {
  return <h2 className="project__heading">{props.children}</h2>;
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const t = useTranslations("Project");
  const actualLocale = getLocaleCookie();
  unstable_setRequestLocale(actualLocale);
  const { slug } = params;
  const filePath = path.join(
    process.cwd(),
    `content/${actualLocale}`,
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const { data: workData, content: workContent } = matter(rawContent);

  const { title, description, date, tags, repo } = workData as WorkData;

  return (
    <main className="project">
      <h1 className="project__title">{title}</h1>
      <div className="project__meta">
        <div className="project__repo">
          <Link href={repo} className="btn">
            <FaGithub />
            {t("github")}
          </Link>
        </div>
        <div className="project__date">
          <span>{date}</span>
          <ImCalendar className="date-icon" />
        </div>
        <div className="project__tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="project__content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: Heading }}>
          {workContent}
        </ReactMarkdown>
      </div>
      <CarouselProject src={workData.img} alt={title} />
    </main>
  );
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"), "utf-8");
  const projectslugs = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => ({ slug: fn.replace(".md", "") }));

  return projectslugs;
}
