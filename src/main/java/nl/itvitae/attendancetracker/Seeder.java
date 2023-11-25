package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRepository;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.attendance.LateAttendance;
import nl.itvitae.attendancetracker.attendance.TypeOfAttendance;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.scheduledday.ScheduledDate;
import nl.itvitae.attendancetracker.scheduledday.ScheduledDateRepository;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
    private final StudentRepository studentRepository;

    private final GroupRepository groupRepository;

    private final ScheduledDateRepository scheduledDayRepository;

    private final AttendanceRepository attendanceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            var group = new Group("Java53");
            groupRepository.save(group);
            var arie = new Student("Arie", group);
            var bas = new Student("Bas", group);
            studentRepository.saveAll(List.of(
                    arie, bas
            ));

            var scheduledDay = new ScheduledDate(LocalDate.of(2023, 11, 27));
            scheduledDay.addGroup(group);
            scheduledDayRepository.save(scheduledDay);
            var ariesAttendance = new TypeOfAttendance(arie, scheduledDay, AttendanceStatus.SICK);
            var basAttendance = new LateAttendance(bas, scheduledDay, LocalTime.of(10, 30));
            attendanceRepository.saveAll(List.of(ariesAttendance, basAttendance));
            System.out.println("Students seeded!");
        }
    }
}
