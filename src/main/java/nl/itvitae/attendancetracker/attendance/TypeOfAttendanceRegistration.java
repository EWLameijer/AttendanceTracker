package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

@Entity
@Getter
@NoArgsConstructor
public class TypeOfAttendanceRegistration extends AttendanceRegistration {
    private AttendanceStatus status;

    public TypeOfAttendanceRegistration(Student student, ScheduledDate date, Personnel personnel, AttendanceStatus status) {
        super(student, date, personnel);
        this.status = status;
    }
}
