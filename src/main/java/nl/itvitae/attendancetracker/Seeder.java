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
import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import nl.itvitae.attendancetracker.scheduleddate.ScheduledDateRepository;
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

            var scheduledDay = new ScheduledDate(LocalDate.of(2023, 11, 27));
            var javaClass = new ScheduledClass(java, wubbo);
            var cyberClass = new ScheduledClass(cyber, niels);
            var dataClass = new ScheduledClass(data, dan);
            scheduledClassRepository.saveAll(List.of(javaClass, cyberClass, dataClass));
            scheduledDay.addClasses(List.of(javaClass, cyberClass, dataClass));
            scheduledDayRepository.save(scheduledDay);
            var ariesAttendance = new TypeOfAttendanceRegistration(arie, scheduledDay, juan, AttendanceStatus.SICK);
            var basAttendance = new LateAttendanceRegistration(bas, scheduledDay, wubbo, LocalTime.of(10, 30));
            var celiasAttendance = new TypeOfAttendanceRegistration(celia, scheduledDay, niels, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = new TypeOfAttendanceRegistration(david, scheduledDay, dan, AttendanceStatus.PRESENT);
            var eduardsAttendance = new TypeOfAttendanceRegistration(eduard, scheduledDay, juan, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = new TypeOfAttendanceRegistration(filippa, scheduledDay, juan, AttendanceStatus.WORKING_FROM_HOME);
            attendanceRegistrationService.saveAll(List.of(ariesAttendance, basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));
            System.out.println("Students seeded!");
        }
    }
}
