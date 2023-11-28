export const capitalize = (text: string) => text[0].toUpperCase() + text.substring(1)

export const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}

export const BASE_URL = 'http://localhost:8080';