package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.*;
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

    private final AttendanceRepository<Attendance> attendanceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            var java = new Group("Java53");
            var cyber = new Group("Cyber52");
            var data = new Group("Data51");

            groupRepository.saveAll(List.of(java, cyber, data));
            var arie = new Student("Arie", java);
            var bas = new Student("Bas", java);
            var celia = new Student("Celine", cyber);
            var david = new Student("David", data);
            var eduard = new Student("Eduard", data);
            var filippa = new Student("Filippa", data);
            studentRepository.saveAll(List.of(
                    arie, bas, celia, david, eduard, filippa
            ));

            var scheduledDay = new ScheduledDate(LocalDate.of(2023, 11, 27));
            scheduledDay.addGroups(List.of(java, cyber, data));
            scheduledDayRepository.save(scheduledDay);
            var ariesAttendance = new TypeOfAttendance(arie, scheduledDay, AttendanceStatus.SICK);
            var basAttendance = new LateAttendance(bas, scheduledDay, LocalTime.of(10, 30));
            var celiasAttendance = new TypeOfAttendance(celia, scheduledDay, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = new TypeOfAttendance(david, scheduledDay, AttendanceStatus.PRESENT);
            var eduardsAttendance = new TypeOfAttendance(eduard, scheduledDay, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = new TypeOfAttendance(filippa, scheduledDay, AttendanceStatus.WORKING_FROM_HOME);
            attendanceRepository.saveAll(List.of(ariesAttendance, basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));
            System.out.println("Students seeded!");
        }
    }
}
