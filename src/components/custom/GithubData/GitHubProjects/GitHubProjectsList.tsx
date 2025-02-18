"use client";

import { useEffect, useRef, useState } from "react";
import { Repository } from "./GitHubProjectsFetcher";
import Image from "next/image";
import styles from "./GitHubProjectsList.module.scss";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";

interface GitHubProjectsListProps {
  repositories: Repository[];
}

export default function GitHubProjectsList({
  repositories,
}: GitHubProjectsListProps) {
  const [currentRepo, setCurrentRepo] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleNext = () => {
    setDirection(-1);
    setTimeout(() => {
      setCurrentRepo((prev) =>
        prev === repositories.length - 1 ? 0 : prev + 1
      );
    }, 10);
  };

  const handlePrevious = () => {
    setDirection(1);
    setTimeout(() => {
      setCurrentRepo((prev) =>
        prev === 0 ? repositories.length - 1 : prev - 1
      );
    }, 10);
  };

  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [currentRepo]);

  return (
    <div className={styles.project}>
      {repositories.length > 0 ? (
        <ProjectGhost repo={repositories[0]}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={repositories[currentRepo].name}
              initial={{
                opacity: 0,
                x: direction * -25 + "vw",
                scale: 0,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: direction * 25 + "vw",
                scale: 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={styles.project__content}
            >
              <Project repo={repositories[currentRepo]} />
            </motion.div>
          </AnimatePresence>
        </ProjectGhost>
      ) : (
        <p>Aucun projet en ligne disponible.</p>
      )}
      <div className={styles.project__pagination}>
        <button
          className={styles.project__arrow}
          onClick={handlePrevious}
          disabled={isAnimating}
        >
          <BiSolidLeftArrow />
        </button>
        <span>
          {currentRepo + 1}/{repositories.length}
        </span>
        <button
          className={styles.project__arrow}
          onClick={handleNext}
          disabled={isAnimating}
        >
          <BiSolidRightArrow />
        </button>
      </div>
    </div>
  );
}

function Project({ repo }: { repo: Repository }) {
  return (
    <>
      <h2 className={styles.project__title}>{repo.description || repo.name}</h2>
      <Image
        src={repo.openGraphImageUrl}
        alt={repo.name}
        width={1000}
        height={1000}
        className={styles.project__image}
        loading="eager"
      />
    </>
  );
}

function ProjectGhost({
  repo,
  children,
}: {
  repo: Repository;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.project__ghost}>
      <h2 className={styles.project__title} style={{ opacity: 0 }}>
        {repo.description || repo.name}
      </h2>
      <Image
        style={{ opacity: 0 }}
        src={repo.openGraphImageUrl}
        alt={repo.name}
        width={1000}
        height={1000}
        className={styles.project__image}
        loading="eager"
      />
      {children}
    </div>
  );
}
