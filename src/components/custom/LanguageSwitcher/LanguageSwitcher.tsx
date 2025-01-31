"use client";

import styles from "./LanguageSwitcher.module.scss";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter, usePathname, Locale } from "@/i18n/routing";
import { GrLanguage } from "react-icons/gr";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const localActive = useLocale();
  const [showSelect, setShowSelect] = useState(false);

  const toggleLanguages = (disabled: boolean) => {
    if (!disabled) {
      setShowSelect((prev) => !prev);
    }
  };

  const handleLanguageChange = (language: Locale, event: React.MouseEvent) => {
    const nextLocale = language as Locale;
    event.stopPropagation();
    if (localActive !== nextLocale) {
      startTransition(() => {
        router.replace(pathname, { locale: nextLocale });
      });
    }
    setShowSelect(false);
  };

  return (
    <div
      className={styles.languageSwitcher}
      onClick={() => toggleLanguages(isPending)}
    >
      <GrLanguage className={styles.languageSwitcher__icon} />
      <ul
        className={`${styles.languageSwitcher__options} ${
          showSelect ? styles.display : styles.hide
        }`}
      >
        <li
          className={`${styles.languageSwitcher__option} ${
            localActive === "fr" ? styles.active : ""
          }`}
          onClick={(event) => {
            handleLanguageChange("fr", event);
          }}
        >
          FR
        </li>
        <li
          className={`${styles.languageSwitcher__option} ${
            localActive === "en" ? styles.active : ""
          }`}
          onClick={(event) => {
            handleLanguageChange("en", event);
          }}
        >
          EN
        </li>
      </ul>
    </div>
  );
}
