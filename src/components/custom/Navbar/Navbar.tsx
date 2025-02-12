"use client";
import styles from "./Navbar.module.scss";
import { Link } from "@/i18n/routing";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbar__logo}>
        <h1 className={styles.navbar__logo_title}>Jérémie Lavergnat</h1>
      </Link>
      <div className={styles.navbar__navigate}>
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
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
