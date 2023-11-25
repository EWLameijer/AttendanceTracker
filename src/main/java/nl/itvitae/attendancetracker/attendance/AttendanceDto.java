package nl.itvitae.attendancetracker.attendance;

public record AttendanceDto(String name, String status) {
    public static AttendanceDto from(Object rawAttendance) {
        if (rawAttendance instanceof LateAttendance lateAttendance) {
            return new AttendanceDto(lateAttendance.getStudent().getName(), lateAttendance.getArrival().toString());
        } else if (rawAttendance instanceof TypeOfAttendance typeOfAttendance) {
            return new AttendanceDto(typeOfAttendance.getStudent().getName(), typeOfAttendance.getStatus().name());
        } else throw new IllegalArgumentException("Attendance object incorrect!");
    }
}
