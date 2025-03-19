"use client";

import { useEffect, useRef, useState } from "react";
import { Repository } from "./GitHubProjectsFetcher";
import Image from "next/image";
import styles from "./GitHubProjectsList.module.scss";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import { IoMdClose } from "react-icons/io";

interface GitHubProjectsListProps {
  repositories: Repository[];
}

export default function GitHubProjectsList({
  repositories,
}: GitHubProjectsListProps) {
  const [currentRepo, setCurrentRepo] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { locale } = useParams();

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

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [currentRepo]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.project}>
        {repositories.length > 0 ? (
          <ProjectGhost repo={repositories[0]}>
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                key={repositories[currentRepo].name}
                initial={{
                  opacity: 0,
                  x: direction * -100 + "%",
                  scale: 0,
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: direction * 100 + "%",
                  scale: 0,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.project__content}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Project repo={repositories[currentRepo]} />
              </motion.div>
            </AnimatePresence>
          </ProjectGhost>
        ) : (
          <p>Error while fetching projects. Please refresh.</p>
        )}
        <div className={styles.project__info}>
          <Link
            href={repositories[currentRepo].homepageUrl}
            className={styles.project__link}
            target="_blank"
          >
            Live Site
          </Link>
          <div className={styles.project__pagination}>
            <button
              className={styles.project__arrow}
              onClick={handlePrevious}
              disabled={isAnimating}
            >
              <BiSolidLeftArrow />
            </button>
            <span className={styles.project__counter}>
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
          <Link
            href={repositories[currentRepo].url}
            className={styles.project__link}
            target="_blank"
          >
            Code Repo
          </Link>
        </div>
      </div>
      {isOpen && (
        <Modal
          repo={repositories[currentRepo]}
          locale={locale}
          closeModal={handleCloseModal}
        />
      )}
    </>
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

function Modal({
  repo,
  locale,
  closeModal,
}: {
  repo: Repository;
  locale: string | string[] | undefined;
  closeModal: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const desc =
    locale === "en"
      ? JSON.parse(repo.object?.text || "{}").description?.en ||
        "No description"
      : JSON.parse(repo.object?.text || "{}").description?.fr ||
        "Pas de description";

  const cleanedDesc = DOMPurify.sanitize(desc);

  const formatDesc = (cleanedDesc: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedDesc, "text/html");

    doc.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
    return doc.body.innerHTML;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current?.contains(e.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal} ref={modalRef}>
        <div dangerouslySetInnerHTML={{ __html: formatDesc(cleanedDesc) }} />
        <button onClick={closeModal} className={styles.modal__close}>
          <IoMdClose />
        </button>
      </div>
    </>
  );
}
