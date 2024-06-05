package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import nl.itvitae.attendancetracker.registrar.Registrar;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;

public record AttendanceRegistrationEntities(Student student, Registrar registrar, LocalDate date) {
}

