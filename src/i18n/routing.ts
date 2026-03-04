import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import {
  DEFAULT_LOCALE,
  isLocaleValue,
  LOCALES,
  type Locale,
} from "./locales";

export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
});

export type { Locale };

export function isLocale(value: unknown): value is Locale {
  return isLocaleValue(value);
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
