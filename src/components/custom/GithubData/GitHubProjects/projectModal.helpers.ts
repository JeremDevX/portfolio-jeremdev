export type SupportedLocale = "en" | "fr";

type RepositoryMetadata = {
  description?: Partial<Record<SupportedLocale, string>>;
};

export function normalizeLocale(
  locale: string | string[] | undefined
): SupportedLocale {
  const localeValue = Array.isArray(locale) ? locale[0] : locale;
  return localeValue === "en" ? "en" : "fr";
}

export function parseRepositoryDescription(
  metadataText: string | undefined,
  locale: SupportedLocale,
  fallbackDescription: string
): string {
  if (!metadataText) {
    return fallbackDescription;
  }

  try {
    const parsedMetadata = JSON.parse(metadataText) as RepositoryMetadata;
    const localizedDescription = parsedMetadata.description?.[locale];

    if (
      typeof localizedDescription === "string" &&
      localizedDescription.trim().length > 0
    ) {
      return localizedDescription;
    }
  } catch {
    return fallbackDescription;
  }

  return fallbackDescription;
}

type ModalKeyboardActionInput = {
  key: string;
  shiftKey: boolean;
  focusableCount: number;
  activeIndex: number;
};

export type ModalKeyboardAction =
  | "none"
  | "close"
  | "trap-empty"
  | "focus-first"
  | "focus-last";

export function resolveModalKeyboardAction({
  key,
  shiftKey,
  focusableCount,
  activeIndex,
}: ModalKeyboardActionInput): ModalKeyboardAction {
  if (key === "Escape") {
    return "close";
  }

  if (key !== "Tab") {
    return "none";
  }

  if (focusableCount === 0) {
    return "trap-empty";
  }

  if (activeIndex < 0) {
    return "focus-first";
  }

  if (shiftKey && activeIndex === 0) {
    return "focus-last";
  }

  if (!shiftKey && activeIndex === focusableCount - 1) {
    return "focus-first";
  }

  return "none";
}
