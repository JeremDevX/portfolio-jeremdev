"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { FC, useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: FC = () => {
  const { toggle, theme } = useContext(ThemeContext);
  console.log("theme", theme);

  return (
    <div className="theme-toggle" onClick={toggle}>
      {theme === "light" ? (
        <FaSun className="theme-toggle__sun" />
      ) : (
        <FaMoon className="theme-toggle__moon" />
      )}
    </div>
  );
};

export default ThemeToggle;
