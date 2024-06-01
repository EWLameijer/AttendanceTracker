package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;

public record AttendanceRegistrationEntities(Student student, Personnel personnel, LocalDate date) {
}

