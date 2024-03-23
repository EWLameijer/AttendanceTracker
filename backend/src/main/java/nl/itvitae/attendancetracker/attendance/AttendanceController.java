package nl.itvitae.attendancetracker.attendance;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.personnel.ATRole;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static nl.itvitae.attendancetracker.Utils.parseLocalDateOrThrow;

@RestController
@CrossOrigin("${at.cors}")
@RequiredArgsConstructor
@RequestMapping("attendances")
public class AttendanceController {

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    private final StudentRepository studentRepository;

    private final PersonnelRepository personnelRepository;

    private final AttendanceVersionService attendanceVersionService;

    private final ScheduledClassRepository scheduledClassRepository;

    @GetMapping("by-student/{studentId}")
    public List<AttendanceRegistrationDto> getByStudent(@PathVariable UUID studentId) {
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceStudentId(studentId);
        var attendances = attendanceRegistrations.stream().map(AttendanceRegistration::getAttendance).distinct();
        return attendances.map(
                        attendance -> attendanceRegistrations.stream()
                                .filter(attendanceRegistration -> attendanceRegistration.getAttendance() == attendance)
                                .max(Comparator.comparing(AttendanceRegistration::getDateTime)))
                .flatMap(Optional::stream).map(AttendanceRegistrationDto::from).toList();
    }

    @Transactional
    @PostMapping
    public ResponseEntity<List<AttendanceRegistrationDto>> register(
            @RequestBody AttendanceRegistrationDto[] attendanceRegistrationDtos,
            UriComponentsBuilder ucb
    ) {
        var resultingRegistrations = new ArrayList<AttendanceRegistration>();
        for (AttendanceRegistrationDto attendanceRegistrationDto : attendanceRegistrationDtos) {
            var possibleStudent = studentRepository.findByNameIgnoringCase(attendanceRegistrationDto.studentName());
            if (possibleStudent.isEmpty()) throw new IllegalArgumentException("No student with that name found!");
            var student = possibleStudent.get();

            var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(attendanceRegistrationDto.date()));

            var possiblePersonnel = personnelRepository.findByNameIgnoringCase(attendanceRegistrationDto.personnelName());
            if (possiblePersonnel.isEmpty()) throw new IllegalArgumentException("Staff name not found");
            var personnel = possiblePersonnel.get();

            var status = attendanceRegistrationDto.status();
            var attendanceRegistration = new AttendanceRegistration(student, date, personnel, toStatus(status), attendanceRegistrationDto.note());
            attendanceRegistrationService.save(attendanceRegistration);
            resultingRegistrations.add(attendanceRegistration);
        }
        if (!resultingRegistrations.isEmpty()) attendanceVersionService.update();

        return ResponseEntity.created(URI.create("")).body(resultingRegistrations.stream().map(AttendanceRegistrationDto::from).toList());
    }

    @GetMapping("latest-update")
    public LocalDateTime getVersion() {
        return attendanceVersionService.getTimeOfLatestUpdate();
    }

    private AttendanceStatus toStatus(String status) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(attendanceStatus -> attendanceStatus.name().equals(status)).findFirst().orElseThrow();
    }

    private ScheduledDateDto getDateDtoForDateAndPersonnel(String dateAsString, String nameOfPersonnel) {
        var chosenDate = parseLocalDateOrThrow(dateAsString);
        var personnel = personnelRepository.findByNameIgnoringCase(nameOfPersonnel)
                .orElseThrow(() -> new IllegalArgumentException("Personnel with this name not found!"));
        var classes = findClassesByDateAndPersonnel(chosenDate, personnel);
        var attendances = findAttendancesByDateAndPersonnel(chosenDate, personnel);
        // if the requested day does not have a schedule, return the most recent lesson date instead
        if (classes.isEmpty()) {
            chosenDate = findPreviousDate(LocalDate.now(), personnel).orElseThrow(() -> new BadRequestException("No nearby lesson date!"));
            attendances = findAttendancesByDateAndPersonnel(chosenDate, personnel);
        }
        var previousDate = findPreviousDate(chosenDate, personnel);
        var nextDate = findNextDate(chosenDate, personnel);
        var attendanceVersion = attendanceVersionService.getTimeOfLatestUpdate();
        var scheduledclassDtos = getScheduledClassDtos(chosenDate, attendances, personnel);
        return new ScheduledDateDto(attendanceVersion, previousDate, chosenDate, nextDate, scheduledclassDtos);
    }

    private List<AttendanceRegistration> findAttendancesByDateAndPersonnel(LocalDate date, Personnel personnel) {
        var attendances = attendanceRegistrationRepository.findByAttendanceDate(date);
        if (personnel.getRole() != ATRole.TEACHER) return attendances;

        // otherwise: find by teacher
        var possibleScheduledClass = scheduledClassRepository.findByDateAndTeacher(date, personnel);
        if (possibleScheduledClass.isEmpty()) return List.of();
        var students = possibleScheduledClass.get().getGroup().getMembers();

        // there may be a better way, to get attendances by group. However, I do not see that now, and
        // our database is likely small enough to make the extra attendances fetched not problematic.
        return attendances.stream()
                .filter(attendanceRegistration -> students.contains(attendanceRegistration.getAttendance().getStudent()))
                .toList();
    }

    private Optional<LocalDate> findPreviousDate(LocalDate date, Personnel personnel) {
        final int dayDirection = -1;
        return findNearestDate(date, dayDirection, personnel);
    }

    private Optional<LocalDate> findNextDate(LocalDate date, Personnel personnel) {
        final int dayDirection = 1;
        return findNearestDate(date, dayDirection, personnel);
    }

    private Optional<LocalDate> findNearestDate(LocalDate originalDate, int dayDirection, Personnel personnel) {
        // students have at most a 3-week holiday: seeing no lessons after 4 weeks means the course started/stopped.
        // Asked Chantal 202312XX: In some cases, she may be willing to give me 4 weeks holiday; so 5 weeks it is
        final int maxDaysToInvestigate = 5 * 7;
        for (int numberOfDays = 1; numberOfDays < maxDaysToInvestigate; numberOfDays++) {
            var dateToInvestigate = originalDate.plusDays((long) dayDirection * numberOfDays);
            var classes = findClassesByDateAndPersonnel(dateToInvestigate, personnel);
            if (!classes.isEmpty()) return Optional.of(dateToInvestigate);
        }
        return Optional.empty();
    }

    private List<ScheduledClass> findClassesByDateAndPersonnel(LocalDate dateToInvestigate, Personnel personnel) {
        return personnel.getRole() == ATRole.TEACHER ?
                scheduledClassRepository.findByDateAndTeacher(dateToInvestigate, personnel).stream().toList() :
                scheduledClassRepository.findAllByDate(dateToInvestigate);
    }

    private ArrayList<ScheduledClassDto> getScheduledClassDtos(LocalDate date, List<AttendanceRegistration> attendanceRegistrations, Personnel personnel) {
        var classes = findClassesByDateAndPersonnel(date, personnel);
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();

        var classDtos = new ArrayList<ScheduledClassDto>();
        for (ScheduledClass scheduledClass : classes)
            classDtos.add(scheduledClassDtoFor(scheduledClass, readableAttendances, date));
        return classDtos;
    }

    @GetMapping("by-date/{dateAsString}")
    public ScheduledDateDto getByDateAndTeacher(@PathVariable String dateAsString, Principal principal) {
        return getDateDtoForDateAndPersonnel(dateAsString, principal.getName());
    }

    private static ScheduledClassDto scheduledClassDtoFor(ScheduledClass chosenClass, List<AttendanceRegistrationDto> readableAttendances, LocalDate date) {
        var group = chosenClass.getGroup();
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
        return new ScheduledClassDto(groupName, chosenClass.getTeacher().getName(), date.toString(), groupAttendances);
    }
}
