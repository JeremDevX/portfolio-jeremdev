"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Repository } from "./GitHubProjectsFetcher";
import Image from "next/image";
import styles from "./GitHubProjectsList.module.scss";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DOMPurify from "dompurify";
import { IoMdClose } from "react-icons/io";

interface GitHubProjectsListProps {
  repositories: Repository[];
}

type SupportedLocale = "en" | "fr";

type RepositoryMetadata = {
  description?: Partial<Record<SupportedLocale, string>>;
};

function normalizeLocale(locale: string | string[] | undefined): SupportedLocale {
  const localeValue = Array.isArray(locale) ? locale[0] : locale;
  return localeValue === "en" ? "en" : "fr";
}

function parseRepositoryDescription(
  metadataText: string | undefined,
  locale: SupportedLocale,
  fallbackDescription: string
): string {
  if (!metadataText) {
    return fallbackDescription;
  }

  try {
    const parsedMetadata = JSON.parse(metadataText) as RepositoryMetadata;
    const localizedDescription = parsedMetadata.description?.[locale];

    if (
      typeof localizedDescription === "string" &&
      localizedDescription.trim().length > 0
    ) {
      return localizedDescription;
    }
  } catch {
    return fallbackDescription;
  }

  return fallbackDescription;
}

export default function GitHubProjectsList({
  repositories,
}: GitHubProjectsListProps) {
  const [currentRepo, setCurrentRepo] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { locale: localeParam } = useParams();
  const locale = normalizeLocale(localeParam);
  const t = useTranslations("Github.projects");
  const prevRepoRef = useRef<number>(currentRepo);

  const handleNext = useCallback(() => {
    setDirection(-1);
    setTimeout(() => {
      setCurrentRepo((prev) =>
        prev === repositories.length - 1 ? 0 : prev + 1
      );
    }, 10);
  }, [repositories.length]);

  const handlePrevious = useCallback(() => {
    setDirection(1);
    setTimeout(() => {
      setCurrentRepo((prev) =>
        prev === 0 ? repositories.length - 1 : prev - 1
      );
    }, 10);
  }, [repositories.length]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle empty repositories
  if (!repositories || repositories.length === 0) {
    return (
      <div className={styles.project}>
        <div className={styles.project__error}>
          <p>{t("emptyStateMessage")}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.project__retry}
          >
            {t("retryButton")}
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
              onClick={handleOpenModal}
            >
              <Project
                repo={repositories[currentRepo]}
                isFirst={currentRepo === 0}
                tooltipText={t("tooltip")}
              />
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
            {t("liveSite")}
          </Link>
          <div className={styles.project__pagination}>
            <button
              className={styles.project__arrow}
              onClick={handlePrevious}
              disabled={isAnimating}
              aria-label={t("previousProjectAriaLabel")}
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
              aria-label={t("nextProjectAriaLabel")}
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
            {t("codeRepo")}
          </Link>
        </div>
      </div>
      {isOpen && (
        <Modal
          repo={repositories[currentRepo]}
          locale={locale}
          fallbackDescription={t("descriptionFallback")}
          closeModalAriaLabel={t("closeModalAriaLabel")}
          closeModal={handleCloseModal}
        />
      )}
    </>
  );
}

function Project({
  repo,
  isFirst = false,
  tooltipText,
}: {
  repo: Repository;
  isFirst?: boolean;
  tooltipText: string;
}) {
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 12, y: e.clientY + 12 });
  };

  return (
    <>
      <h2 className={styles.project__title}>{repo.description || repo.name}</h2>
      <div
        className={styles.project__imageWrapper}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Image
          src={repo.openGraphImageUrl}
          alt={repo.name}
          width={1200}
          height={630}
          className={styles.project__image}
          style={{ width: "100%", height: "auto" }}
          loading={isFirst ? "eager" : "lazy"}
          priority={isFirst}
        />
        <span
          className={`${styles.project__tooltip} ${
            showTooltip ? styles["project__tooltip--visible"] : ""
          }`}
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          {tooltipText}
        </span>
      </div>
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
        style={{ opacity: 0, width: "95%", height: "auto" }}
        src={repo.openGraphImageUrl}
        alt=""
        aria-hidden="true"
        width={1200}
        height={630}
        className={styles.project__image}
        loading="lazy"
      />
      {children}
    </div>
  );
}

interface ModalProps {
  repo: Repository;
  locale: SupportedLocale;
  fallbackDescription: string;
  closeModalAriaLabel: string;
  closeModal: () => void;
}

function Modal({
  repo,
  locale,
  fallbackDescription,
  closeModalAriaLabel,
  closeModal,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const desc = parseRepositoryDescription(
    repo.object?.text,
    locale,
    fallbackDescription
  );

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

  // Extraire le titre (h2) du contenu et le reste
  const extractTitleAndContent = (
    html: string
  ): { title: string; content: string } => {
    if (typeof window === "undefined") {
      return { title: repo.name, content: html };
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const h2 = doc.querySelector("h2");
    const title = h2?.textContent || repo.name;
    if (h2) h2.remove();
    return { title, content: doc.body.innerHTML };
  };

  const { title, content } = extractTitleAndContent(formatDesc(desc));

  return (
    <>
      <div className={styles.overlay} aria-hidden="true" onClick={closeModal} />
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modal__header}>
          <h2 id="modal-title">{title}</h2>
        </div>
        <div
          className={styles.modal__body}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <button
          onClick={closeModal}
          className={styles.modal__close}
          aria-label={closeModalAriaLabel}
        >
          <IoMdClose />
        </button>
      </div>
    </>
  );
}
