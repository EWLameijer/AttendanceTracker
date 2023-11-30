export const capitalize = (text: string) => text[0].toUpperCase() + text.substring(1)

export const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}

export const BASE_URL = 'http://localhost:8080';

const padToTwoDigits = (number: number) => number.toString().padStart(2, '0')

export const toYYYYMMDD = (date: Date) => `${date.getFullYear()}-${padToTwoDigits(date.getMonth() + 1)}-${padToTwoDigits(date.getDate())}`

export const statusToAbbreviation = new Map<string, string>([
    ["ABSENT_WITH_NOTICE", "am"],
    ["ABSENT_WITHOUT_NOTICE", "az"],
    ["NOT REGISTERED YET", ""],
    ["PRESENT", "p"],
    ["SICK", "z"],
    ["WORKING_FROM_HOME", "t"]
]);

export const toStatusAbbreviation = (statusText: string) => statusToAbbreviation.get(statusText) ?? statusText;

const standardize = (text: string) => text.trim().toLocaleLowerCase()

const extractDigits = (text: string) => text.split("").filter(a => a >= '0' && a <= '9');

export const isValidAbbreviation = (abbreviation: string) => {
    const statusAbbreviations = statusToAbbreviation.values();
    if ([...statusAbbreviations].includes(standardize(abbreviation))) return true;
    const digits = extractDigits(abbreviation);
    return digits.length == 4 && digits[0] == '1' && digits[1] <= '5' && digits[2] <= '5';
}

export const format = (abbreviation: string) => {
    const digits = extractDigits(abbreviation);
    if (digits.length == 4) {
        digits.splice(2, 0, ":") // as of 20231126, toSpliced not available in current TypeScript version
        return digits.join("");
    }
    return ([...statusToAbbreviation.entries()].find(entry => entry[1] == standardize(abbreviation)))![0];
}

