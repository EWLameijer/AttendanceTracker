export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.substring(1);

export const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
