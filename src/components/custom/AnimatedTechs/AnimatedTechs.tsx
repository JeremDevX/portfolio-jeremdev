"use client";

import {
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { AnimatedTooltip } from "../../ui/animated-tooltip";
import styles from "./AnimatedTechs.module.scss";
import { FaFigma, FaGithub, FaNodeJs, FaReact, FaSass } from "react-icons/fa";
import { motion } from "framer-motion";

const dropShadowStyle = {
  filter: "drop-shadow(0 0 10px var(--accent))",
  background:
    "radial-gradient(circle, rgba(21,174,0,0.5) 0%, rgba(0,0,0,0) 80%)",
};

const mainSkills = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: "React",
    designation: "Frontend Framework",
    image: (
      <FaReact color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
  {
    id: 4,
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
    id: 5,
    name: "Sass",
    designation: "CSS Preprocessor",
    image: (
      <FaSass color="#000" className="w-full h-full" style={dropShadowStyle} />
    ),
  },
  {
    id: 6,
    name: "GitHub",
    designation: "Version Control Platform",
    image: (
      <FaGithub
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
];

const secondarySkills = [
  {
    id: 1,
    name: "Node.js",
    designation: "Backend Framework",
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
    name: "Prisma",
    designation: "Object-Relational Mapping",
    image: (
      <SiPrisma
        color="#000"
        className="w-full h-full"
        style={dropShadowStyle}
      />
    ),
  },
  {
    id: 3,
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
    id: 4,
    name: "Figma",
    designation: "UI/UX Design Tool",
    image: (
      <FaFigma color="#000" className="w-full h-full" style={dropShadowStyle} />
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
