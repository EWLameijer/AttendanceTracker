package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationService;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.attendance.LateAttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.TypeOfAttendanceRegistration;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.ATRole;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
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

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final PersonnelRepository personnelRepository;

    private final ScheduledClassRepository scheduledClassRepository;

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
            var xerxes = new Student("Xerxes", cyber);
            var david = new Student("David", data);
            var eduard = new Student("Eduard", data);
            var filippa = new Student("Filippa", data);
            studentRepository.saveAll(List.of(
                    arie, bas, celia, david, eduard, filippa, xerxes
            ));
            var wubbo = new Personnel("Wubbo", ATRole.TEACHER);
            var niels = new Personnel("Niels", ATRole.TEACHER);
            var juan = new Personnel("Juan", ATRole.COACH);
            var dan = new Personnel("Dan", ATRole.TEACHER);
            personnelRepository.saveAll(List.of(wubbo, niels, dan, juan));

            var scheduledDate = LocalDate.now();
            var javaClass = new ScheduledClass(java, wubbo, scheduledDate);
            var cyberClass = new ScheduledClass(cyber, niels, scheduledDate);
            var dataClass = new ScheduledClass(data, dan, scheduledDate);
            scheduledClassRepository.saveAll(List.of(javaClass, cyberClass, dataClass));

            var ariesAttendance = new TypeOfAttendanceRegistration(arie, scheduledDate, juan, AttendanceStatus.SICK);
            var basAttendance = new LateAttendanceRegistration(bas, scheduledDate, wubbo, LocalTime.of(10, 30));
            var celiasAttendance = new TypeOfAttendanceRegistration(celia, scheduledDate, niels, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = new TypeOfAttendanceRegistration(david, scheduledDate, dan, AttendanceStatus.PRESENT);
            var eduardsAttendance = new TypeOfAttendanceRegistration(eduard, scheduledDate, juan, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = new TypeOfAttendanceRegistration(filippa, scheduledDate, juan, AttendanceStatus.WORKING_FROM_HOME);
            attendanceRegistrationService.saveAll(List.of(ariesAttendance, basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));
            System.out.println("Students seeded!");
        }
    }
}
