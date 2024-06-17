package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceService;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.registrar.ATRole;
import nl.itvitae.attendancetracker.registrar.Registrar;
import nl.itvitae.attendancetracker.registrar.RegistrarService;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.student.StudentRepository;
import nl.itvitae.attendancetracker.teacher.Teacher;
import nl.itvitae.attendancetracker.workeridentity.WorkerService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
    private final StudentRepository studentRepository;

    private final GroupRepository groupRepository;

    private final AttendanceService attendanceService;

    private final RegistrarService registrarService;

    private final ScheduledClassRepository scheduledClassRepository;
    private final WorkerService workerService;

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() == 0) {
            var java = new Group("Java53");
            var cyber = new Group("Cyber52");
            var data = new Group("Data51");

            groupRepository.saveAll(List.of(java, cyber, data));
            var arie = new Student("Arie", java);
            var bas = new Student("Bas", java);
            var zebedeus = new Student("Zebedeus", java);
            var celia = new Student("Celine", cyber);
            var xerxes = new Student("Xerxes", cyber);
            var david = new Student("David", data);
            var eduard = new Student("Eduard", data);
            var filippa = new Student("Filippa", data);
            studentRepository.saveAll(List.of(
                    arie, bas, celia, david, eduard, filippa, xerxes, zebedeus
            ));
            var wubboAsRegistrar = workerService.saveRegistrar("Wubbo", "Wubbo", ATRole.TEACHER);
            var nielsAsRegistrar = workerService.saveRegistrar("Niels", "Niels", ATRole.TEACHER);
            var juan = workerService.saveRegistrar("Juan", "Juan", ATRole.COACH);
            var nouchka = workerService.saveRegistrar("Nouchka", "Nouchka", ATRole.ADMIN);
            var dan = workerService.saveExternalTeacher("Dan");
            var chantal = workerService.saveRegistrar("Chantal", "Chantal", ATRole.SUPER_ADMIN);
            var wubboAsTeacher = registrarService.asTeacher(wubboAsRegistrar);
            var nielsAsTeacher = registrarService.asTeacher(nielsAsRegistrar);

            var scheduledDate = LocalDate.now();
            var javaClass = new ScheduledClass(java, wubboAsTeacher, scheduledDate);
            var cyberClass = new ScheduledClass(cyber, nielsAsTeacher, scheduledDate);
            var dataClass = new ScheduledClass(data, dan, scheduledDate);
            scheduledClassRepository.saveAll(List.of(javaClass, cyberClass, dataClass));

            var ariesAttendance = AttendanceRegistrationDto.of(arie, scheduledDate, juan, AttendanceStatus.SICK);
            var basAttendance = AttendanceRegistrationDto.of(bas, scheduledDate, wubboAsRegistrar, AttendanceStatus.LATE, "10:30 (trein)");
            var celiasAttendance = AttendanceRegistrationDto.of(celia, scheduledDate, nielsAsRegistrar, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = AttendanceRegistrationDto.of(david, scheduledDate, juan, AttendanceStatus.PRESENT);
            var eduardsAttendance = AttendanceRegistrationDto.of(eduard, scheduledDate, juan, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = AttendanceRegistrationDto.of(filippa, scheduledDate, juan, AttendanceStatus.WORKING_FROM_HOME);
            attendanceService.saveAll(List.of(ariesAttendance, basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));

            createHistory(java, 90, wubboAsTeacher, juan);
            createHistory(cyber, 180, nielsAsTeacher, juan);
            createHistory(data, 270, dan, juan);
            System.out.println("Students seeded!");
        }
    }

    private void createHistory(Group group, int days, Teacher teacher, Registrar registrar) {
        var today = LocalDate.now().minusDays(1);
        var nextDaysPerformance = new HashMap<Student, AttendanceRegistrationDto>();
        for (Student student : group.getMembers()) {
            nextDaysPerformance.put(student, AttendanceRegistrationDto.of(student, today, registrar, AttendanceStatus.PRESENT));
        }
        for (int day = 1; day < days; day++) {
            var dateToAssess = today.minusDays(day);
            if (isStudyDay(dateToAssess.getDayOfWeek())) {
                scheduledClassRepository.save(new ScheduledClass(group, teacher, dateToAssess));
                for (Student student : group.getMembers()) {
                    AttendanceRegistrationDto currentAttendance = getNewAttendance(student, dateToAssess, registrar, nextDaysPerformance.get(student));
                    nextDaysPerformance.put(student, currentAttendance);
                    attendanceService.save(currentAttendance);
                }
            }
        }
    }

    private final Random rand = new Random();

    private AttendanceRegistrationDto getNewAttendance(
            Student student,
            LocalDate dateToAssess,
            Registrar registrar,
            AttendanceRegistrationDto currentAttendanceRegistration) {
        if (rand.nextInt(100) < 70)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar,
                    AttendanceStatus.valueOf(currentAttendanceRegistration.status()), currentAttendanceRegistration.note());
        var nextRand = rand.nextInt(100);
        if (nextRand < 20)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.LATE, "10:20");
        else if (nextRand < 23)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.WORKING_FROM_HOME);
        else if (nextRand < 27)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITH_NOTICE);
        else if (nextRand < 30)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
        else if (nextRand < 90)
            return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.PRESENT);
        else return AttendanceRegistrationDto.of(student, dateToAssess, registrar, AttendanceStatus.SICK);
    }

    private boolean isStudyDay(DayOfWeek dayOfWeek) {
        return dayOfWeek == DayOfWeek.MONDAY || dayOfWeek == DayOfWeek.TUESDAY || dayOfWeek == DayOfWeek.THURSDAY;
    }
}
