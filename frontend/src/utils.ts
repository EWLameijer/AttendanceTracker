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