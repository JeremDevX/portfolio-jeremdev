"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const prevRepoRef = useRef<number>(currentRepo);

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

  // Trigger animation when currentRepo changes
  useEffect(() => {
    if (prevRepoRef.current !== currentRepo) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      prevRepoRef.current = currentRepo;
      return () => clearTimeout(timer);
    }
  }, [currentRepo]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Gestion du cas où il n'y a pas de projets
  if (!repositories || repositories.length === 0) {
    return (
      <div className={styles.project}>
        <div className={styles.project__error}>
          <p>Impossible de charger les projets pour le moment.</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.project__retry}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.project}>
        <ProjectGhost repo={repositories[0]}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
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
        <div className={styles.project__info}>
          <Link
            href={repositories[currentRepo].homepageUrl}
            className={styles.project__link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Site
          </Link>
          <div className={styles.project__pagination}>
            <button
              className={styles.project__arrow}
              onClick={handlePrevious}
              disabled={isAnimating}
              aria-label="Projet précédent"
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
              aria-label="Projet suivant"
            >
              <BiSolidRightArrow />
            </button>
          </div>
          <Link
            href={repositories[currentRepo].url}
            className={styles.project__link}
            target="_blank"
            rel="noopener noreferrer"
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

  // Sanitize et format uniquement côté client
  const formatDesc = (rawDesc: string): string => {
    if (typeof window === "undefined") {
      return rawDesc;
    }

    const cleanedDesc = DOMPurify.sanitize(rawDesc);
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedDesc, "text/html");

    doc.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
    return doc.body.innerHTML;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current?.contains(e.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <>
      <div className={styles.overlay} aria-hidden="true" />
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div dangerouslySetInnerHTML={{ __html: formatDesc(desc) }} />
        <button
          onClick={closeModal}
          className={styles.modal__close}
          aria-label="Fermer le modal"
        >
          <IoMdClose />
        </button>
      </div>
    </>
  );
}
