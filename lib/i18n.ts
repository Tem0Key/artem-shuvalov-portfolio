export const LANGUAGES = ["en", "ru", "es"] as const;
export type Language = typeof LANGUAGES[number];

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some(language => language === value);
}
