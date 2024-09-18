import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiCodewars, SiCodingame } from "react-icons/si";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "JeremDevX - Profil",
  description:
    "Profil JeremDevX : retrouvez la liste de mes réseaux sociaux, mon CV, mes coordonnées et autres.",
};

const calculateAge = (birthDate: string) => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (dateRegex.test(birthDate)) {
    const birth = new Date(birthDate);
    const today = new Date();
    let ageYear = today.getFullYear() - birth.getFullYear();
    let ageMonth = today.getMonth() - birth.getMonth();
    let ageDay = today.getDate() - birth.getDate();

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      ageYear--;
      ageMonth += 12;
    }

    if (ageDay < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      ageDay += lastMonth.getDate();
      ageMonth--;
    }

    return { ageYear, ageMonth, ageDay };
  } else {
    throw new Error("Birth data is not in a valid format");
  }
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
    label: "X - (Twitter)",
    icon: <FaSquareXTwitter />,
  },
  {
    href: "https://www.codewars.com/users/JeremDevX",
    label: "CodeWars",
    icon: <SiCodewars />,
  },
  // {
  //   href: "https://www.codingame.com/profile/ad8792d8f207fbbed03d9cc327b7a07e4414845",
  //   label: "CodinGame",
  //   icon: <SiCodingame />,
  // },
];

export default function Profile() {
  const t = useTranslations("Profile");
  const birthDate = "1995-06-12";
  const age = calculateAge(birthDate);
  const { ageYear, ageMonth, ageDay } = age;
  return (
    <main className="profile">
      <h1 className="profile__title">{t("title")}</h1>
      <section className="profile__details">
        <div className="profile__infos">
          <h2 className="profile__heading">{t("infos")}</h2>
          <ul>
            {t.rich("personalInfos", {
              li: (richText) => <li>{richText}</li>,
              strong: (richText) => <strong>{richText}</strong>,
              ul: (richText) => <ul>{richText}</ul>,
              ageYear: () => (
                <>
                  {ageYear} {t("years")}
                  {ageMonth !== 0 && ageDay !== 0 && ","}
                </>
              ),
              ageMonth: () => (
                <>
                  {ageMonth !== 0 &&
                    `${
                      ageDay === 0
                        ? `${t("and")} ${ageMonth} ${
                            ageMonth === 1 || ageMonth === 0
                              ? t("month")
                              : t("months")
                          }`
                        : ` ${ageMonth} ${
                            ageMonth === 1 || ageMonth === 0
                              ? t("month")
                              : t("months")
                          }`
                    }`}
                </>
              ),
              ageDay: () => (
                <>
                  {ageDay !== 0 &&
                    `${t("and")} ${ageDay} ${t("day")}${
                      ageDay === 1 ? "" : "s"
                    }`}
                </>
              ),
            })}
          </ul>
        </div>
        <div className="profile__socials-stats">
          <h2 className="profile__heading">{t("socialsAndStats")}:</h2>
          <ul className="profile__socials">
            {socialLinks.map(({ href, label, icon }) => (
              <li key={label}>
                <Link href={href} target="_blank" rel="noopener noreferrer">
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
