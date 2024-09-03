import type { Metadata } from "next";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiCodewars, SiCodingame } from "react-icons/si";

export const metadata: Metadata = {
  title: "JeremDevX - Profil",
  description:
    "Profil JeremDevX : retrouvez la liste de mes réseaux sociaux, mon CV, mes coordonnées et autres.",
};

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/jeremie-lavergnat",
    label: "Linkedin",
    icon: <FaLinkedin />,
  },
  {
    href: "https://github.com/JeremDevX",
    label: "GitHub",
    icon: <FaGithub />,
  },
  {
    href: "https://x.com/JeremDevX",
    label: "x - (Twitter)",
    icon: <FaSquareXTwitter />,
  },
  {
    href: "https://www.codewars.com/users/JeremDevX",
    label: "CodeWars",
    icon: <SiCodewars />,
  },
  {
    href: "https://www.codingame.com/profile/ad8792d8f207fbbed03d9cc327b7a07e4414845",
    label: "CodinGame",
    icon: <SiCodingame />,
  },
];

export default function Profile() {
  return (
    <main className="profile">
      <h1 className="profile__title">Mon profil</h1>
      <div className="profile__cv">
        <Link href="/CV-JeremDevX.pdf" target="_blank" className="btn">
          Télécharger mon CV
        </Link>
      </div>
      <section className="profile__details">
        <div className="profile__infos">
          <h2 className="profile__heading">Infos :</h2>
          <ul>
            <li>
              <strong>Nom :</strong> Jérémie L.
            </li>
            <li>
              <strong>Date de naissance :</strong> 12/06/1995
            </li>
            <li>
              <strong>Nationalité :</strong> Française
            </li>
            <li>
              <strong>Localisation :</strong> France / Suisse
            </li>
            <li>
              <strong>Mail : </strong> jeremdev.contactpro@gmail.com
            </li>
            <li>
              <strong>Langues :</strong>
              <ul>
                <li>Français - (Langue natale)</li>
                <li>Anglais - (Compétence professionnelle)</li>
                <li>Allemand - (En cours d&apos;apprentissage)</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="profile__socials-stats">
          <h2 className="profile__heading">Réseaux et Stats :</h2>
          <ul className="profile__socials">
            {socialLinks.map(({ href, label, icon }) => (
              <li key={label}>
                <Link href={href} target="_blank">
                  {label} {icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
