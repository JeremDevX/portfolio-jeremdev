"use client";

import { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards";
import ProjectCard from "./project-card";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("CarouselHome");
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

  const projects = [
    {
      title: "Simon Game",
      techList: ["React", "ViteJS", "Typescript"],
      description: t("simonGame"),
      imgSrc: "/project-img/simon-game/simon-card.png",
      alt: "Photo Simon Game",
      href: "/projects/simon-game-project",
    },
    {
      title: "Argent Bank",
      techList: ["React", "Redux", "Strapi"],
      description: t("argentBank"),
      imgSrc: "/project-img/argent-bank/bank-card.png",
      alt: "Photo Argent Bank",
      href: "/projects/argent-bank-project",
    },
    {
      title: "Nina Carducci",
      techList: ["LightHouse", "SEO", "Performance"],
      description: t("ninaCarducci"),
      imgSrc: "/project-img/carducci/nina-card.png",
      alt: "Photo Nina Carducci",
      href: "/projects/nina-carducci-project",
    },
    {
      title: "Kasa",
      techList: ["React", "React-Router", "Sass"],
      description: t("kasa"),
      imgSrc: "/project-img/kasa/kasa-card.png",
      alt: "Photo Kasa",
      href: "/projects/kasa-project",
    },
    {
      title: "QCM",
      techList: ["NodeJS", "Prisma", "PostgreSQL"],
      description: t("qcm"),
      imgSrc: "/project-img/qcm/qcm-card.png",
      alt: "Photo QCM",
      href: "/projects/qcm-project",
    },
  ];

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
