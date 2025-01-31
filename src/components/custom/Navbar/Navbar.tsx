"use client";
import styles from "./Navbar.module.scss";
import { Link, usePathname } from "@/i18n/routing";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const links = [
    { href: t("home.href"), label: t("home.label") },
    { href: t("projects.href"), label: t("projects.label") },
    { href: t("profile.href"), label: t("profile.label") },
  ];

  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbar__logo}>
        <h1 className={styles.navbar__logo_title}>Jérémie Lavergnat</h1>
      </Link>
      <div className={styles.navbar__navigate}>
        {/* <div className={styles.navbar__links}>
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navbar__link} ${
                href === pathname ? styles.active : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div> */}
        <div className={styles.navbar__socials}>
          <Link
            href="https://github.com/JeremDevX"
            target="_blank"
            aria-label="GitHub"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jeremie-lavergnat"
            target="_blank"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </Link>
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            target="_blank"
            aria-label="mail"
          >
            <IoIosMail />
          </Link>
          {/* <ThemeToggle /> */}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
