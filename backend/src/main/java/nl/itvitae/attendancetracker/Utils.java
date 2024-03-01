package nl.itvitae.attendancetracker;

import java.time.LocalDate;

public class Utils {
    public static LocalDate parseLocalDateOrThrow(String input) {
        try {
            return LocalDate.parse(input);
        } catch (Exception e) {
            throw new BadRequestException("Please provide the date in this format: \"YYYY-MM-DD\"");
        }
    }
}
