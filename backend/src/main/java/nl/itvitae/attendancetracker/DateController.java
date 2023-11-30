package nl.itvitae.attendancetracker;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class DateController {
    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    private final ScheduledClassRepository scheduledClassRepository;

    private final PersonnelRepository personnelRepository;

    @GetMapping("coach-view/{nameOfCoach}/dates/{dateAsString}")
    public List<ScheduledClassDto> getByDate(@PathVariable String dateAsString, @PathVariable String nameOfCoach) {
        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceDate(date);
        var classes = scheduledClassRepository.findAllByDate(date);
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();

        var classDtos = new ArrayList<ScheduledClassDto>();
        for (ScheduledClass scheduledClass : classes)
            classDtos.add(scheduledClassDtoFor(scheduledClass, readableAttendances, date));
        return classDtos;
    }

    @GetMapping("teacher-view/{nameOfTeacher}/dates/{dateAsString}")
    public ScheduledClassDto getByDateAndTeacher(@PathVariable String dateAsString, @PathVariable String nameOfTeacher) {
        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceDate(date);
        var possibleTeacher = personnelRepository.findByNameIgnoringCase(nameOfTeacher);
        if (possibleTeacher.isEmpty()) return null;
        var teacher = possibleTeacher.get();
        var possibleClass = scheduledClassRepository.findByDateAndTeacher(date, teacher);
        if (possibleClass.isEmpty()) return null;
        var chosenClass = possibleClass.get();
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();
        return scheduledClassDtoFor(chosenClass, readableAttendances, date);
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
                            .orElse(new AttendanceRegistrationDto(null, studentName, null, "NOT REGISTERED YET", null, null, null)));
        }
        return new ScheduledClassDto(groupName, chosenClass.getTeacher().getName(), date.toString(), groupAttendances);
    }
}
