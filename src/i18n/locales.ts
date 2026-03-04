export const LOCALES = ["en", "fr"] as const;
export const DEFAULT_LOCALE = "fr" as const;

export type Locale = (typeof LOCALES)[number];

export function isLocaleValue(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.some((locale) => locale === value);
}
