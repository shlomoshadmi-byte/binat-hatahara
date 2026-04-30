import type { Language, LocalizedText } from "@/lib/config/schema";

export function text(value: LocalizedText, language: Language): string {
  return value[language] || value.en;
}

export function direction(language: Language): "ltr" | "rtl" {
  return language === "he" ? "rtl" : "ltr";
}
