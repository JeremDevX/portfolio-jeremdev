"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import styles from "./page.module.scss";

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ error, reset }: RouteErrorProps) {
  const locale = useLocale();
  const isFrench = locale === "fr";

  useEffect(() => {
    console.error("Route rendering failed:", error);
  }, [error]);

  return (
    <main className={styles.home}>
      <section className={styles.contact}>
        <h2 className={styles.contact__title}>
          {isFrench ? "Une erreur est survenue" : "Something went wrong"}
        </h2>
        <p className={styles.contact__desc}>
          {isFrench
            ? "Le contenu n'a pas pu etre charge correctement."
            : "The page content could not be loaded correctly."}
        </p>
        <button type="button" className="btn" onClick={reset}>
          {isFrench ? "Reessayer" : "Try again"}
        </button>
      </section>
    </main>
  );
}
