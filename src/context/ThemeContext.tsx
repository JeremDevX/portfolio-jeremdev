"use client";

import { createContext, useEffect, useState } from "react";

interface ThemeContextProps {
  theme: string;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggle: () => {},
});

const getFromLocalStorageOrUserPreference = () => {
  if (typeof window !== "undefined") {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || (prefersDarkMode ? "dark" : "light");
  }

  return "light";
};

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState(() => {
    return getFromLocalStorageOrUserPreference();
  });

  const toggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
