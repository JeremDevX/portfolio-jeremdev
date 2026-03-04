import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.home}>
      <section className={styles.contact}>
        <h2 className={styles.contact__title}>Loading...</h2>
        <p className={styles.contact__desc}>Preparing the page content.</p>
      </section>
    </main>
  );
}
