package nl.itvitae.attendancetracker.scheduleddate;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("dates")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ScheduledDateController {
    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    private final ScheduledClassRepository scheduledClassRepository;

    private final PersonnelRepository personnelRepository;

    @GetMapping("{dateAsString}")
    public List<ScheduledClassDto> getByDate(@PathVariable String dateAsString) {
        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceDate(date);
        var classes = scheduledClassRepository.findAllByDate(date);
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();

        var classDtos = new ArrayList<ScheduledClassDto>();
        for (ScheduledClass scheduledClass : classes) {
            var group = scheduledClass.getGroup();
            var groupName = group.getName();
            var groupAttendances = new ArrayList<AttendanceRegistrationDto>();
            for (Student student : group.getMembers()) {
                var studentName = student.getName();
                groupAttendances.add(
                        readableAttendances.stream()
                                .filter(a -> a.studentName().equals(studentName))
                                .max(Comparator.comparing(AttendanceRegistrationDto::timeOfRegistration))
                                .orElse(new AttendanceRegistrationDto(null, studentName, null, "NOT REGISTERED YET", null, null)));
            }
            classDtos.add(new ScheduledClassDto(groupName, scheduledClass.getTeacher().getName(), date.toString(), groupAttendances));
        }
        return classDtos;
    }

//    @GetMapping("{dateAsString}/teachers/{nameOfTeacher}")
//    public ScheduledDateDto getByDateAndTeacher(@PathVariable String dateAsString, @PathVariable String nameOfTeacher) {
//        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
//        var possibleDate = scheduledDateRepository.findByDate(date);
//        if (possibleDate.isEmpty()) return null; // not found
//        var scheduledDate = possibleDate.get();
//
//        var possibleTeacher = personnelRepository.findByName(nameOfTeacher);
//        if (possibleTeacher.isEmpty()) return null; // change to not found
//        var teacher = possibleTeacher.get();
//
//        var group = scheduledDate.getClasses().stream().filter(currentClass -> currentClass.getTeacher().getName().equals(nameOfTeacher)).findFirst().orElseThrow();
//
//
//        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceDate(scheduledDate);
//        var classes = scheduledDate.getClasses();
//        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();
//
//        var classDtos = new ArrayList<ScheduledClassDto>();
//        for (ScheduledClass scheduledClass : classes) {
//            var group = scheduledClass.getGroup();
//            var groupName = group.getName();
//            var groupAttendances = new ArrayList<AttendanceRegistrationDto>();
//            for (Student student : group.getMembers()) {
//                var studentName = student.getName();
//                groupAttendances.add(
//                        readableAttendances.stream()
//                                .filter(a -> a.studentName().equals(studentName))
//                                .max(Comparator.comparing(AttendanceRegistrationDto::timeOfRegistration))
//                                .orElse(new AttendanceRegistrationDto(null, studentName, null, "NOT REGISTERED YET", null, null)));
//            }
//            classDtos.add(new ScheduledClassDto(groupName, scheduledClass.getTeacher().getName(), groupAttendances));
//        }
//        return new ScheduledDateDto(date, classDtos);
//    }
}
