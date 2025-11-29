"use client";

import {
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiTypescript,
  SiSanity,
  SiStrapi,
  SiGitlab,
  SiPython,
  SiPhp,
  SiHtml5,
  SiCss3,
  SiJavascript,
} from "react-icons/si";
import { AnimatedTooltip } from "../../ui/animated-tooltip";
import styles from "./AnimatedTechs.module.scss";
import { FaGithub, FaNodeJs, FaReact, FaSass } from "react-icons/fa";
import { motion } from "framer-motion";

const dropShadowStyle = {
  filter: "drop-shadow(0 0 10px var(--accent))",
  background:
    "radial-gradient(circle, rgba(21,174,0,0.5) 0%, rgba(0,0,0,0) 80%)",
};

const mainSkills = [
  {
    id: 1,
    name: "React",
    designation: "Frontend Framework",
    image: (
      <FaReact color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
  {
    id: 2,
    name: "Next.js",
    designation: "Fullstack Framework",
    image: (
      <SiNextdotjs
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 3,
    name: "TypeScript",
    designation: "JavaScript Superset",
    image: (
      <SiTypescript
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 4,
    name: "JavaScript",
    designation: "Programming Language",
    image: (
      <SiJavascript
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 5,
    name: "Tailwind CSS",
    designation: "CSS Framework",
    image: (
      <SiTailwindcss
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 6,
    name: "Sass",
    designation: "CSS Preprocessor",
    image: (
      <FaSass color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
  {
    id: 7,
    name: "HTML5",
    designation: "Markup Language",
    image: (
      <SiHtml5 color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
  {
    id: 8,
    name: "CSS3",
    designation: "Stylesheet Language",
    image: (
      <SiCss3 color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
];

const secondarySkills = [
  {
    id: 1,
    name: "Node.js",
    designation: "Backend Runtime",
    image: (
      <FaNodeJs
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 2,
    name: "PostgreSQL",
    designation: "Database",
    image: (
      <SiPostgresql
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 3,
    name: "Prisma",
    designation: "ORM",
    image: (
      <SiPrisma
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 4,
    name: "GitHub",
    designation: "Version Control",
    image: (
      <FaGithub
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 5,
    name: "GitLab",
    designation: "DevOps Platform",
    image: (
      <SiGitlab
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 6,
    name: "Sanity",
    designation: "Headless CMS",
    image: (
      <SiSanity
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 7,
    name: "Strapi",
    designation: "Headless CMS",
    image: (
      <SiStrapi
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 8,
    name: "Python",
    designation: "Programming Language",
    image: (
      <SiPython
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 9,
    name: "PHP",
    designation: "Backend Language",
    image: (
      <SiPhp color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
];

export function AnimatedTechs(props: {
  skills: "main" | "secondary";
  reverseAnimation?: boolean;
  delay?: boolean;
}) {
  const { skills = "main", reverseAnimation, delay } = props;
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: reverseAnimation ? "10vw" : "-10vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay ? 0.5 : 0 }}
    >
      <AnimatedTooltip
        items={skills === "main" ? mainSkills : secondarySkills}
      />
    </motion.div>
  );
}
