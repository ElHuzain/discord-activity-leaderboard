import locales from "../../localization.json";
import { LANGUAGE } from "./config";

type Locale = keyof typeof locales;
type TranslationKey = keyof typeof locales.en;

export function t(key: TranslationKey, variables: Record<string, string | number> = {}, locale: string = LANGUAGE): string {
  const dict: Record<string, string> = locales[locale as Locale] || locales.en;
  let text = String(dict[key] || locales.en[key] || key);

  for (const [vKey, vValue] of Object.entries(variables)) {
    text = text.replace(new RegExp(`{{${vKey}}}`, "g"), String(vValue));
  }

  if (locale === "ar") {
    return `\u061C${text}`;
  }

  return text;
}

export function getTimeFromMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function formatTime(hours: number, minutes: number, seconds: number) {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function getYesterdayRange(): { start: number; end: number } {
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setDate(now.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.getTime(),
    end: end.getTime(),
  };
}

export function getWeekRange(timestamp: number): { start: number; end: number } {
  const date = new Date(timestamp);

  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.getTime(),
    end: end.getTime(),
  };
}
