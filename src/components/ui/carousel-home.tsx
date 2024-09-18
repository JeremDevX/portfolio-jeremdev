"use client";

import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards";
import ProjectCard from "./project-card";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from "@/i18n/routing";

function useWindowWidth() {
  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceWidth;
}

export default function CarouselHome() {
  const [mounted, setMounted] = useState(false);
  const deviceWidth = useWindowWidth();
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const handleForward = () => {
    setCurrentCard((prev) => (prev + 1) % projects.length);
  };
  const handleBack = () => {
    if (currentCard === 0) {
      setCurrentCard(projects.length - 1);
      return;
    }
    setCurrentCard((prev) => (prev - 1) % projects.length);
  };

  return (
    <>
      {deviceWidth > 1024 ? (
        <InfiniteMovingCards items={projects} speed="normal" />
      ) : (
        <div className="carousel-container">
          <IoIosArrowBack
            className="carousel-back-arrow"
            onClick={() => {
              handleBack();
            }}
          />
          <Link href={projects[currentCard].href}>
            <ProjectCard
              title={projects[currentCard].title}
              techList={projects[currentCard].techList}
              description={projects[currentCard].description}
              imgSrc={projects[currentCard].imgSrc}
              alt={projects[currentCard].alt}
              className="mobile"
            />
          </Link>
          <IoIosArrowForward
            className="carousel-forward-arrow"
            onClick={() => {
              handleForward();
            }}
          />
        </div>
      )}
    </>
  );
}
const projects = [
  {
    title: "Simon Game",
    techList: ["React", "ViteJS", "Typescript"],
    description:
      "Création d'un jeu de Simon en utilisant React. Projet pour comprendre le state mangement, les cylces de vie des composants et les hooks.",
    imgSrc: "/project-img/simon-game/simon-card.png",
    alt: "Photo du Simon Game",
    href: "/works/simon-game-project",
  },
  {
    title: "Argent Bank",
    techList: ["React", "Redux", "Strapi"],
    description:
      "Intégration d'une application bancaire, avec un système d'authentification via une API et un store global via Redux.",
    imgSrc: "/project-img/argent-bank/bank-card.png",
    alt: "Photo du site Argent Bank",
    href: "/works/argent-bank-project",
  },
  {
    title: "Nina Carducci",
    techList: ["LightHouse", "SEO", "Optimisation"],
    description:
      "Optimisation d'un site web d'une photographe sur le réferecement naturel, la performance et l'accessibilité.",
    imgSrc: "/project-img/carducci/nina-card.png",
    alt: "Photo du site Nina Carducci",
    href: "/works/nina-carducci-project",
  },
  {
    title: "Kasa",
    techList: ["React", "React-Router", "Sass"],
    description:
      "Intégration d'un site de location immobilière. Projet pour gérer les routes, les paramètres d'URL et mettre en ouevre des animations CSS via Sass.",
    imgSrc: "/project-img/kasa/kasa-card.png",
    alt: "Photo du site Kasa",
    href: "/works/kasa-project",
  },
  {
    title: "QCM",
    techList: ["NodeJS", "Prisma", "PostgreSQL"],
    description:
      "Création d'une application de QCM. Projet pour gérer une base de données avec un ORM, créer un système d'authetification avec un token JWT et sécuriser les routes.",
    imgSrc: "/project-img/qcm/qcm-card.png",
    alt: "Photo de l'application QCM",
    href: "/works/qcm-project",
  },
];
