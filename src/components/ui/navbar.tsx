"use client";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import ThemeToggle from "../themeToggle";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../languageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const links = [
    { href: t("home.href"), label: t("home.label") },
    { href: t("projects.href"), label: t("projects.label") },
    { href: t("profile.href"), label: t("profile.label") },
  ];

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar__logo">
        <Image
          src="/jeremdevx-logo.png"
          alt="JeremDevX logo"
          width={150}
          height={50}
          priority
        />
      </Link>
      <div className="navbar__navigate">
        <div className="navbar__links">
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`navbar__link ${href === pathname ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="navbar__socials">
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
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
