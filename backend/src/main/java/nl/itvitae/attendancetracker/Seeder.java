package nl.itvitae.attendancetracker;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.*;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.ATRole;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.personnel.PersonnelService;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
    private final StudentRepository studentRepository;

    private final GroupRepository groupRepository;

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final PersonnelService personnelService;

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
            var wubbo = personnelService.save("Wubbo", "Wubbo", ATRole.TEACHER);
            var niels = personnelService.save("Niels", "Niels", ATRole.TEACHER);
            var juan = personnelService.save("Juan", "Juan", ATRole.COACH);
            var nouchka = personnelService.save("Nouchka", "Nouchka", ATRole.COACH);
            var dan = personnelService.save("Dan", "Dan", ATRole.TEACHER);
            var chantal = personnelService.save("Chantal", "Chantal", ATRole.ADMIN);

            var scheduledDate = LocalDate.now();
            var javaClass = new ScheduledClass(java, wubbo, scheduledDate);
            var cyberClass = new ScheduledClass(cyber, niels, scheduledDate);
            var dataClass = new ScheduledClass(data, dan, scheduledDate);
            scheduledClassRepository.saveAll(List.of(javaClass, cyberClass, dataClass));

            //var ariesAttendance = new TypeOfAttendanceRegistration(arie, scheduledDate, juan, AttendanceStatus.SICK);
            var basAttendance = new LateAttendanceRegistration(bas, scheduledDate, wubbo, LocalTime.of(10, 30));
            //var zebeAttendance = new LateAttendanceRegistration(bas, scheduledDate, wubbo, LocalTime.of(10, 30));
            var celiasAttendance = new TypeOfAttendanceRegistration(celia, scheduledDate, niels, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
            var davidsAttendance = new TypeOfAttendanceRegistration(david, scheduledDate, dan, AttendanceStatus.PRESENT);
            var eduardsAttendance = new TypeOfAttendanceRegistration(eduard, scheduledDate, juan, AttendanceStatus.ABSENT_WITH_NOTICE);
            var filippasAttendance = new TypeOfAttendanceRegistration(filippa, scheduledDate, juan, AttendanceStatus.WORKING_FROM_HOME);
            attendanceRegistrationService.saveAll(List.of(basAttendance, celiasAttendance, davidsAttendance, eduardsAttendance, filippasAttendance));

            createHistory(java, 90, wubbo, juan);
            createHistory(cyber, 180, niels, juan);
            createHistory(data, 270, dan, juan);
            System.out.println("Students seeded!");
        }
    }

    private void createHistory(Group group, int days, Personnel teacher, Personnel registrar) {
        var today = LocalDate.now().minusDays(1);
        var nextDaysPerformance = new HashMap<Student, AttendanceRegistration>();
        for (Student student : group.getMembers()) {
            nextDaysPerformance.put(student, new TypeOfAttendanceRegistration(student, today, registrar, AttendanceStatus.PRESENT));
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
            Personnel registrar,
            AttendanceRegistration currentAttendanceRegistration) {
        if (rand.nextInt(100) < 70) {
            if (currentAttendanceRegistration instanceof TypeOfAttendanceRegistration typeOfAttendanceRegistration) {
                return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, typeOfAttendanceRegistration.getStatus());
            } else {
                return new LateAttendanceRegistration(student, dateToAssess, registrar, LocalTime.of(10, 30));
            }
        }
        var nextRand = rand.nextInt(100);
        if (nextRand < 20)
            return new LateAttendanceRegistration(student, dateToAssess, registrar, LocalTime.of(10, 15));
        else if (nextRand < 23)
            return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.WORKING_FROM_HOME);
        else if (nextRand < 27)
            return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITH_NOTICE);
        else if (nextRand < 30)
            return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.ABSENT_WITHOUT_NOTICE);
        else if (nextRand < 90)
            return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.PRESENT);
        else return new TypeOfAttendanceRegistration(student, dateToAssess, registrar, AttendanceStatus.SICK);
    }

    private boolean isStudyDay(DayOfWeek dayOfWeek) {
        return dayOfWeek == DayOfWeek.MONDAY || dayOfWeek == DayOfWeek.TUESDAY || dayOfWeek == DayOfWeek.THURSDAY;
    }
}
