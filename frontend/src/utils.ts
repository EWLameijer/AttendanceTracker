import { Status } from "./Class";

export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.substring(1);

export const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const BASE_URL = "http://localhost:8080";

const padToTwoDigits = (number: number) => number.toString().padStart(2, "0");

export const toYYYYMMDD = (date: Date) =>
  `${date.getFullYear()}-${padToTwoDigits(
    date.getMonth() + 1
  )}-${padToTwoDigits(date.getDate())}`;

export const statusToAbbreviation = new Map<string, string>([
  [Status.ABSENT_WITH_NOTICE, "am"],
  [Status.ABSENT_WITHOUT_NOTICE, "az"],
  [Status.LATE, "tl"],
  [Status.NOT_REGISTERED_YET, ""],
  [Status.PRESENT, "p"],
  [Status.SICK, "z"],
  [Status.WORKING_FROM_HOME, "t"],
]);

export const toStatusAbbreviation = (statusText: string) =>
  statusToAbbreviation.get(statusText) ?? statusText;

const standardize = (text: string) => text.trim().toLocaleLowerCase();

export const isValidAbbreviation = (abbreviation: string) =>
  [...statusToAbbreviation.values()].includes(standardize(abbreviation));

export const format = (abbreviation: string) =>
  [...statusToAbbreviation.entries()].find(
    (entry) => entry[1] == standardize(abbreviation)
  )![0];
