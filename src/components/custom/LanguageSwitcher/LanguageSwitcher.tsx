"use client";

import styles from "./LanguageSwitcher.module.scss";
import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useRouter, usePathname, Locale } from "@/i18n/routing";
import { GrLanguage } from "react-icons/gr";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const localActive = useLocale();
  const [showSelect, setShowSelect] = useState(false);
  const languageSwitcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsId = useId();

  const closeSelect = useCallback(() => {
    setShowSelect(false);
  }, []);

  const toggleLanguages = () => {
    if (!isPending) {
      setShowSelect((prev) => !prev);
    }
  };

  const handleLanguageChange = (language: Locale) => {
    if (isPending) {
      return;
    }

    const nextLocale = language;

    if (localActive !== nextLocale) {
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale });
      });
    }

    closeSelect();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (!event.currentTarget.contains(nextFocusedElement)) {
      closeSelect();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSelect();
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!showSelect) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent) => {
      if (
        languageSwitcherRef.current &&
        !languageSwitcherRef.current.contains(event.target as Node)
      ) {
        closeSelect();
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
    };
  }, [showSelect, closeSelect]);

  const triggerAriaLabel =
    localActive === "fr" ? "Changer la langue" : "Change language";

  const localeOptions: Locale[] = ["fr", "en"];

  const renderLocaleLabel = (locale: Locale) => locale.toUpperCase();

  const getOptionAriaLabel = (locale: Locale) =>
    localActive === "fr"
      ? `Passer en ${locale.toUpperCase()}`
      : `Switch to ${locale.toUpperCase()}`;

  const getIsLocaleActive = (locale: Locale) => localActive === locale;

  const isOptionDisabled = (locale: Locale) =>
    isPending || getIsLocaleActive(locale);

  const getOptionClassName = (locale: Locale) =>
    `${styles.languageSwitcher__optionButton} ${
      getIsLocaleActive(locale) ? styles.active : ""
    }`;

  const handleOptionClick = (locale: Locale) => {
    handleLanguageChange(locale);
  };

  return (
    <div
      className={styles.languageSwitcher}
      ref={languageSwitcherRef}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.languageSwitcher__trigger}
        onClick={toggleLanguages}
        ref={triggerRef}
        aria-label={triggerAriaLabel}
        aria-controls={optionsId}
        aria-expanded={showSelect}
        disabled={isPending}
      >
        <GrLanguage className={styles.languageSwitcher__icon} />
      </button>
      <ul
        id={optionsId}
        role="menu"
        className={`${styles.languageSwitcher__options} ${
          showSelect ? styles.display : styles.hide
        }`}
        aria-hidden={!showSelect}
      >
        {localeOptions.map((locale) => (
          <li key={locale} role="none" className={styles.languageSwitcher__item}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={getIsLocaleActive(locale)}
              aria-label={getOptionAriaLabel(locale)}
              className={getOptionClassName(locale)}
              onClick={() => handleOptionClick(locale)}
              disabled={isOptionDisabled(locale)}
              tabIndex={showSelect ? 0 : -1}
            >
              {renderLocaleLabel(locale)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
