package nl.itvitae.attendancetracker.attendance;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationRepository;
import nl.itvitae.attendancetracker.lesson.Lesson;
import nl.itvitae.attendancetracker.lesson.LessonDto;
import nl.itvitae.attendancetracker.lesson.LessonRepository;
import nl.itvitae.attendancetracker.registrar.ATRole;
import nl.itvitae.attendancetracker.registrar.Registrar;
import nl.itvitae.attendancetracker.registrar.RegistrarRepository;
import nl.itvitae.attendancetracker.registrar.RegistrarService;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static nl.itvitae.attendancetracker.Utils.parseLocalDateOrThrow;

@RestController
@CrossOrigin("${at.cors}")
@RequiredArgsConstructor
@RequestMapping("attendances")
public class AttendanceController {

    private final AttendanceRegistrationRepository attendanceRegistrationRepository;

    private final AttendanceService attendanceService;

    private final RegistrarRepository registrarRepository;

    private final AttendanceVersionService attendanceVersionService;

    private final LessonRepository lessonRepository;

    private final RegistrarService registrarService;

    @GetMapping("by-student/{studentId}")
    public List<AttendanceRegistrationDto> getByStudent(@PathVariable UUID studentId) {
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceStudentId(studentId);
        var attendances = attendanceRegistrations.stream().map(AttendanceRegistration::getAttendance).distinct();
        var today = LocalDate.now();
        return attendances.map(
                        attendance -> attendanceRegistrations.stream()
                                .filter(attendanceRegistration -> attendanceRegistration.getAttendance() == attendance)
                                .max(Comparator.comparing(AttendanceRegistration::getDateTime)))
                .flatMap(Optional::stream)
                .filter(attendanceRegistration -> !attendanceRegistration.getAttendance().getDate().isAfter(today))
                .map(AttendanceRegistrationDto::from).toList();
    }

    @PostMapping
    public ResponseEntity<List<AttendanceRegistrationDto>> register(
            @RequestBody List<AttendanceRegistrationDto> attendanceRegistrationDtos,
            UriComponentsBuilder ucb
    ) {
        attendanceService.saveAll(attendanceRegistrationDtos);
        attendanceVersionService.update();
        return ResponseEntity.created(URI.create("")).body(attendanceRegistrationDtos);
    }

    @GetMapping("latest-update")
    public LocalDateTime getVersion() {
        return attendanceVersionService.getTimeOfLatestUpdate();
    }

    private AttendanceStatus toStatus(String status) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(attendanceStatus -> attendanceStatus.name().equals(status)).findFirst().orElseThrow();
    }

    private ScheduledDateDto getDateDtoForDateAndRegistrar(String dateAsString, String nameOfRegistrar, boolean dateShouldBeExact) {
        var chosenDate = parseLocalDateOrThrow(dateAsString);
        var registrar = registrarRepository.findByIdentityNameIgnoringCase(nameOfRegistrar)
                .orElseThrow(() -> new IllegalArgumentException("Personnel with this name not found!"));
        var lessons = findLessonsByDateAndRegistrar(chosenDate, registrar);
        var attendances = findAttendancesByDateAndRegistrar(chosenDate, registrar);
        // if the requested day does not have a schedule and the match need not be exact,
        // return the most recent lesson date instead
        if (lessons.isEmpty() && !dateShouldBeExact) {
            chosenDate = findPreviousDate(LocalDate.now(), registrar).
                    orElseGet(() -> findNextDate(LocalDate.now(), registrar).
                            orElseThrow(() -> new BadRequestException("No nearby lesson date!")));
            attendances = findAttendancesByDateAndRegistrar(chosenDate, registrar);
        }
        var previousDate = findPreviousDate(chosenDate, registrar);
        var nextDate = findNextDate(chosenDate, registrar);
        var attendanceVersion = attendanceVersionService.getTimeOfLatestUpdate();
        var lessonDtos = getLessonDtos(chosenDate, attendances, registrar);
        return new ScheduledDateDto(attendanceVersion, previousDate, chosenDate, nextDate, lessonDtos);
    }

    private List<AttendanceRegistration> findAttendancesByDateAndRegistrar(LocalDate date, Registrar registrar) {
        var attendances = attendanceRegistrationRepository.findByAttendanceDate(date);
        if (registrar.getRole() != ATRole.TEACHER) return attendances;

        // otherwise: find by teacher
        var teacher = registrarService.asTeacher(registrar);
        var possibleLesson = lessonRepository.findByDateAndTeacher(date, teacher);
        if (possibleLesson.isEmpty()) return List.of();
        var students = possibleLesson.get().getGroup().getMembers();

        // there may be a better way, to get attendances by group. However, I do not see that now, and
        // our database is likely small enough to make the extra attendances fetched not problematic.
        return attendances.stream()
                .filter(attendanceRegistration -> students.contains(attendanceRegistration.getAttendance().getStudent()))
                .toList();
    }

    private Optional<LocalDate> findPreviousDate(LocalDate date, Registrar registrar) {
        final int dayDirection = -1;
        return findNearestDate(date, dayDirection, registrar);
    }

    private Optional<LocalDate> findNextDate(LocalDate date, Registrar registrar) {
        final int dayDirection = 1;
        return findNearestDate(date, dayDirection, registrar);
    }

    private Optional<LocalDate> findNearestDate(LocalDate originalDate, int dayDirection, Registrar registrar) {
        // students have at most a 3-week holiday: seeing no lessons after 4 weeks means the course started/stopped.
        // Asked Chantal 202312XX: In some cases, she may be willing to give me 4 weeks holiday; so 5 weeks it is
        final int maxDaysToInvestigate = 5 * 7;
        for (int numberOfDays = 1; numberOfDays < maxDaysToInvestigate; numberOfDays++) {
            var dateToInvestigate = originalDate.plusDays((long) dayDirection * numberOfDays);
            var lessons = findLessonsByDateAndRegistrar(dateToInvestigate, registrar);
            if (!lessons.isEmpty()) return Optional.of(dateToInvestigate);
        }
        return Optional.empty();
    }

    private List<Lesson> findLessonsByDateAndRegistrar(LocalDate dateToInvestigate, Registrar registrar) {
        return registrar.getRole() == ATRole.TEACHER ?
                lessonRepository.findByDateAndTeacher(dateToInvestigate, registrarService.asTeacher(registrar)).stream().toList() :
                lessonRepository.findAllByDate(dateToInvestigate);
    }

    private ArrayList<LessonDto> getLessonDtos(LocalDate date, List<AttendanceRegistration> attendanceRegistrations, Registrar registrar) {
        var lessons = findLessonsByDateAndRegistrar(date, registrar);
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();

        var lessonDtos = new ArrayList<LessonDto>();
        for (Lesson lesson : lessons)
            lessonDtos.add(lessonDtoFor(lesson, readableAttendances, date));
        return lessonDtos;
    }

    @GetMapping("by-date/{dateAsString}")
    public ScheduledDateDto getByDateAndTeacher(@PathVariable String dateAsString, Principal principal) {
        return getDateDtoForDateAndRegistrar(dateAsString, principal.getName(), false);
    }

    @GetMapping("by-exact-date/{dateAsString}")
    public ScheduledDateDto getByExactDateAndTeacher(@PathVariable String dateAsString, Principal principal) {
        return getDateDtoForDateAndRegistrar(dateAsString, principal.getName(), true);
    }

    private static LessonDto lessonDtoFor(Lesson chosenLesson, List<AttendanceRegistrationDto> readableAttendances, LocalDate date) {
        var group = chosenLesson.getGroup();
        var groupName = group.getName();
        var groupAttendances = new ArrayList<AttendanceRegistrationDto>();
        for (Student student : group.getMembers()) {
            var studentName = student.getName();
            groupAttendances.add(
                    readableAttendances.stream()
                            .filter(a -> a.studentName().equals(studentName))
                            .max(Comparator.comparing(AttendanceRegistrationDto::timeOfRegistration))
                            .orElse(new AttendanceRegistrationDto(null, studentName, null, "NOT_REGISTERED_YET", null, null, null)));
        }
        var teacherName = chosenLesson.getTeacher().getIdentity().getName();
        return new LessonDto(groupName, teacherName, date.toString(), groupAttendances);
    }
}
