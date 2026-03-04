import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr"],

  defaultLocale: "fr",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    routing.locales.some((locale) => locale === value)
  );
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
