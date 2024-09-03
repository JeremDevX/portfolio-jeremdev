import CarouselHome from "@/components/ui/carousel-home";
import TechItem from "@/components/ui/tech-item";
import Image from "next/image";
import Link from "next/link";
import {
  FaCss3Alt,
  FaHtml5,
  FaJsSquare,
  FaSass,
  FaReact,
  FaGithub,
  FaNodeJs,
} from "react-icons/fa";
import { SiTypescript, SiStrapi, SiPostgresql, SiPrisma } from "react-icons/si";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JeremDevX - Développeur Web",
  description:
    "Portfolio de JeremDevX, développeur web React, Next.js. Découvrez mes compétences et mes réalisations.",
};

const techList = {
  mainTech: [
    { name: "React", icon: <FaReact color="#61DAFB" /> },
    {
      name: "TypeScript",
      icon: <SiTypescript color="#3178C6" />,
    },
    { name: "Sass", icon: <FaSass color="#CC6699" /> },
    { name: "Git", icon: <FaGithub color="#FFF" /> },
    { name: "HTML", icon: <FaHtml5 color="#E34F26" /> },
    { name: "CSS", icon: <FaCss3Alt color="#1572B6" /> },
    {
      name: "JavaScript",
      icon: <FaJsSquare color="#F7DF1E" />,
    },
  ],
  secondaryTech: [
    {
      name: "React Native",
      icon: <FaReact color="#61DAFB" />,
      color: "#61DAFB",
    },
    { name: "Node.js", icon: <FaNodeJs color="#339933" /> },
    { name: "Prisma", icon: <SiPrisma color="#FFF" /> },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql color="#336791" />,
      color: "#336791",
    },
    { name: "Strapi", icon: <SiStrapi color="#3F3DFF" /> },
  ],
};

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero__content">
          <h1>
            JeremDev<span className="accent">X</span>
          </h1>
          <h2>Front End Developper</h2>
          <p>
            Développeur web spécialisé dans le front-end, je maîtrise des
            technologies comme <span className="accent bold">React</span>,
            <span className="accent bold"> Next.js</span>,
            <span className="accent bold"> Sass</span>, et
            <span className="accent bold"> TypeScript</span> pour concevoir des
            interfaces modernes et entièrement responsives. J’ai également des
            connaissances en <span className="accent bold">React Native </span>
            et en développement back-end avec
            <span className="accent bold"> PostgreSQL</span>,
            <span className="accent bold"> Node.js </span>, et
            <span className="accent bold"> Prisma </span>, ce qui me permet de
            comprendre l’ensemble du cycle de développement web. Passionné par
            mon métier, j’affine chaque jour mes compétences pour offrir des
            solutions adaptées aux besoins actuels.
          </p>
          <div className="hero__buttons">
            <Link href="/CV-JeremDevX.pdf" target="_blank" className="btn">
              Télécharger mon CV
            </Link>
          </div>
        </div>
        <div className="hero__img-container">
          <Image
            src="/photo-hero.png"
            alt="Avatar de JeremDevX"
            width={350}
            height={350}
            className="hero__img"
            priority
          />
        </div>
      </section>
      <section className="skills">
        <h2>Mes compétences</h2>
        <h3>Compétences principales</h3>
        <div className="skill-list">
          {techList.mainTech.map((tech, idx) => (
            <TechItem key={idx} techName={tech.name} icon={tech.icon} />
          ))}
        </div>
        <h3>Compétences secondaires / Connaissances </h3>
        <div className="skill-list">
          {techList.secondaryTech.map((tech, idx) => (
            <TechItem key={idx} techName={tech.name} icon={tech.icon} />
          ))}
        </div>
      </section>
      <section className="projects">
        <h2>Mes projets</h2>
        <CarouselHome />
      </section>
    </main>
  );
}
