"use client";

import { ThemeContext } from "@/context/ThemeContext";
import { FC, useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: FC = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle" onClick={toggle}>
      <div className="theme-toggle__icons">
        <FaSun
          className={`theme-toggle__sun ${
            theme === "light" ? "display" : "hide"
          }`}
        />
        <FaMoon
          className={`theme-toggle__moon ${
            theme === "dark" ? "display" : "hide"
          }`}
        />
      </div>
    </div>
  );
};

export default ThemeToggle;
