export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.substring(1);

export const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const FRONTEND_URL = "http://localhost:5173"; // when in production, need to get this from some kind of settings?

export const BASE_URL = "http://localhost:8080";

export const toYYYYMMDD = (date: Date) => date.toISOString().substring(0, 10);

interface Named {
  name: string;
}

export const byName = (a: Named, b: Named) => a.name.localeCompare(b.name);

export interface Registrar {
  id: string;
  name: string;
  role: string;
}
