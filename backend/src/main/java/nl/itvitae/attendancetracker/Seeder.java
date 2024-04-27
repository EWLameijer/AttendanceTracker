package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationService;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.student.StudentRepository;
import nl.itvitae.attendancetracker.worker.Worker;
import nl.itvitae.attendancetracker.worker.WorkerService;
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

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final WorkerService workerService;

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
            var zebedeus = new Student("Zebedeus", java);
            var celia = new Student("Celine", cyber);
            var xerxes = new Student("Xerxes", cyber);
            var david = new Student("David", data);
            var eduard = new Student("Eduard", data);
            var filippa = new Student("Filippa", data);
            studentRepository.saveAll(List.of(
                    arie, bas, celia, david, eduard, filippa, xerxes, zebedeus
            ));
            var wubbo = workerService.createRegisteringTeacher("Wubbo", "Wubbo").orElseThrow();
            var niels = workerService.createRegisteringTeacher("Niels", "Niels").orElseThrow();
            var juan = workerService.createAdmin("Juan", "Juan").orElseThrow();
            var nouchka = workerService.createAdmin("Nouchka", "Nouchka");
            var chantal = workerService.createAdmin("Chantal", "Chantal");

            var dan = workerService.createScheduledTeacher("Dan").orElseThrow();

            var scheduledDate = LocalDate.now();
            var javaClass = new ScheduledClass(java, wubbo, scheduledDate);
            var cyberClass = new ScheduledClass(cyber, niels, scheduledDate);
            var dataClass = new ScheduledClass(data, dan, scheduledDate);
            scheduledClassRepository.saveAll(List.of(javaClass, cyberClass, dataClass));

            //var ariesAttendance = new TypeOfAttendanceRegistration(arie, scheduledDate, juan, AttendanceStatus.SICK);
            var basAttendance = new AttendanceRegistration(bas, scheduledDate, wubbo, AttendanceStatus.LATE, "10:30 (trein)");
            //var zebeAttendance = new LateAttendanceRegistration(bas, scheduledDate, wubbo, LocalTime.of(10, 30));
            var celiasAttendance = new AttendanceRegistration(celia, scheduledDate, niels, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = new AttendanceRegistration(david, scheduledDate, juan, AttendanceStatus.PRESENT);
            var eduardsAttendance = new AttendanceRegistration(eduard, scheduledDate, juan, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = new AttendanceRegistration(filippa, scheduledDate, juan, AttendanceStatus.WORKING_FROM_HOME);
            attendanceRegistrationService.saveAll(List.of(basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));

            createHistory(java, 90, wubbo, juan);
            createHistory(cyber, 180, niels, juan);
            createHistory(data, 270, dan, juan);
            System.out.println("Students seeded!");
        }
    }


    private void createHistory(Group group, int days, Worker teacher, Worker registrar) {
        var today = LocalDate.now().minusDays(1);
        var nextDaysPerformance = new HashMap<Student, AttendanceRegistration>();
        for (Student student : group.getMembers()) {
            nextDaysPerformance.put(student, new AttendanceRegistration(student, today, registrar, AttendanceStatus.PRESENT));
        }
        for (int day = 1; day < days; day++) {
            var dateToAssess = today.minusDays(day);
            if (isStudyDay(dateToAssess.getDayOfWeek())) {
                scheduledClassRepository.save(new ScheduledClass(group, teacher, dateToAssess));
                for (Student student : group.getMembers()) {
                    AttendanceRegistration currentAttendance = getNewAttendance(student, dateToAssess, registrar, nextDaysPerformance.get(student));
                    nextDaysPerformance.put(student, currentAttendance);
                    attendanceRegistrationService.save(currentAttendance);
                }
            }
        }
    }

    private final Random rand = new Random();

    private AttendanceRegistration getNewAttendance(
            Student student,
            LocalDate dateToAssess,
            Worker registrar,
            AttendanceRegistration currentAttendanceRegistration) {
        if (rand.nextInt(100) < 70)
            return new AttendanceRegistration(student, dateToAssess, registrar, currentAttendanceRegistration.getStatus(), currentAttendanceRegistration.getNote());
        var nextRand = rand.nextInt(100);
        if (nextRand < 20)
            return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.LATE, "10:20");
        else if (nextRand < 23)
            return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.WORKING_FROM_HOME);
        else if (nextRand < 27)
            return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITH_NOTICE);
        else if (nextRand < 30)
            return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
        else if (nextRand < 90)
            return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.PRESENT);
        else return new AttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.SICK);
    }

    private boolean isStudyDay(DayOfWeek dayOfWeek) {
        return dayOfWeek == DayOfWeek.MONDAY || dayOfWeek == DayOfWeek.TUESDAY || dayOfWeek == DayOfWeek.THURSDAY;
    }
}
