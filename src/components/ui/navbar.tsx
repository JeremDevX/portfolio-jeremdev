"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import ThemeToggle from "../themeToggle";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/works", label: "Réalisations" },
  { href: "/profile", label: "Profil" },
];

export default function Navbar() {
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
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`navbar__link ${pathname === href ? "active" : ""}`}
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
        </div>
      </div>
    </nav>
  );
}
