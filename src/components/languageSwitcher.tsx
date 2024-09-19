"use client";

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
      className="language-switcher"
      onClick={() => toggleLanguages(isPending)}
    >
      <GrLanguage />
      <ul
        className={`language-switcher__options ${
          showSelect ? "display" : "hide"
        }`}
      >
        <li
          className={`language-switcher__option ${
            localActive === "fr" ? "active" : ""
          }`}
          onClick={(event) => {
            handleLanguageChange("fr", event);
          }}
        >
          FR
        </li>
        <li
          className={`language-switcher__option ${
            localActive === "en" ? "active" : ""
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
