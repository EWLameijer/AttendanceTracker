package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.scheduledday.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

@Entity
@Getter
@NoArgsConstructor
public class TypeOfAttendance extends Attendance {
    private AttendanceStatus status;

    public TypeOfAttendance(Student student, ScheduledDate date, AttendanceStatus status) {
        super(student, date);
        this.status = status;
    }
}
