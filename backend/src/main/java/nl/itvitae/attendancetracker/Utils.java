package nl.itvitae.attendancetracker;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class Utils {
    public static LocalDate parseLocalDateOrThrow(String input) {
        try {
            return LocalDate.parse(input);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Please provide the date in this format: \"YYYY-MM-DD\"");
        }
    }
}
