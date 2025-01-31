"use client";
import styles from "./ThemeToggle.module.scss";
import { ThemeContext } from "@/context/ThemeContext";
import { FC, useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: FC = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <div className={styles.themeToggle} onClick={toggle}>
      <div className={styles.themeToggle__icons}>
        <FaSun
          className={`${styles.themeToggle__sun} ${
            theme === "light" ? styles.display : styles.hide
          }`}
        />
        <FaMoon
          className={`${styles.themeToggle__moon} ${
            theme === "dark" ? styles.display : styles.hide
          }`}
        />
      </div>
    </div>
  );
};

export default ThemeToggle;
