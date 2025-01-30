"use client";
import {
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiStrapi,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { AnimatedTooltip } from "../../ui/animated-tooltip";
import styles from "./AnimatedTechs.module.scss";
import { FaGithub, FaNodeJs, FaReact, FaSass } from "react-icons/fa";

const mainSkills = [
  {
    id: 1,
    name: "Next.js",
    designation: "Fullstack Framework",
    image: <SiNextdotjs color="#000" className="w-full h-full" />,
  },
  {
    id: 2,
    name: "TypeScript",
    designation: "JavaScript Superset",
    image: <SiTypescript color="#3178C6" className="w-full h-full" />,
  },
  {
    id: 3,
    name: "React",
    designation: "Frontend Framework",
    image: <FaReact color="#61DAFB" className="w-full h-full" />,
  },
  {
    id: 4,
    name: "Tailwind CSS",
    designation: "CSS Framework",
    image: <SiTailwindcss color="#00bcff" className="w-full h-full" />,
  },
  {
    id: 5,
    name: "Sass",
    designation: "CSS Preprocessor",
    image: <FaSass color="#CC6699" className="w-full h-full" />,
  },
  {
    id: 6,
    name: "GitHub",
    designation: "Version Control Platform",
    image: <FaGithub color="#FFF" className="w-full h-full" />,
  },
];

const secondarySkills = [
  {
    id: 1,
    name: "React Native",
    designation: "Mobile Framework",
    image: <FaReact color="#61DAFB" className="w-full h-full" />,
  },
  {
    id: 2,
    name: "Node.js",
    designation: "Backend Framework",
    image: <FaNodeJs color="#339933" className="w-full h-full" />,
  },
  {
    id: 3,
    name: "Prisma",
    designation: "ORM",
    image: <SiPrisma color="#FFF" className="w-full h-full" />,
  },
  {
    id: 4,
    name: "PostgreSQL",
    designation: "Database",
    image: <SiPostgresql color="#336791" className="w-full h-full" />,
  },
];

export function AnimatedTechs(props: { skills: "main" | "secondary" }) {
  const { skills = "main" } = props;
  return (
    <div className={styles.container}>
      <AnimatedTooltip
        items={skills === "main" ? mainSkills : secondarySkills}
      />
    </div>
  );
}
