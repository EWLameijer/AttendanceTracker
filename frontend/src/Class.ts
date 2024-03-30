import { toStatusAbbreviation } from "./utils";

export interface Attendance {
  studentName: string;
  status: string;
  date: string;
  personnelName: string;
  timeOfRegistration?: string;
  note?: string;
  savedStatus?: string;
  savedNote?: string;
}

export const Status = {
  ABSENT_WITH_NOTICE: "ABSENT_WITH_NOTICE",
  ABSENT_WITHOUT_NOTICE: "ABSENT_WITHOUT_NOTICE",
  LATE: "LATE",
  NOT_REGISTERED_YET: "NOT_REGISTERED_YET",
  PRESENT: "PRESENT",
  SICK: "SICK",
  WORKING_FROM_HOME: "WORKING_FROM_HOME",
};

const statusTranslations = new Map<string, string>([
  [Status.ABSENT_WITH_NOTICE, "afwezig met bericht"],
  [Status.ABSENT_WITHOUT_NOTICE, "AFWEZIG ZONDER BERICHT"],
  [Status.LATE, "te laat"],
  [Status.NOT_REGISTERED_YET, "NOG NIET GEREGISTREERD"],
  [Status.PRESENT, "aanwezig"],
  [Status.SICK, "ziek"],
  [Status.WORKING_FROM_HOME, "werkt thuis"],
]);

export const translateAttendanceStatus = (status: string) =>
  statusTranslations.get(status);

export const displayAttendance = (attendance: Attendance) =>
  `${attendance.studentName}: ${translateAttendanceStatus(attendance.status)}` +
  (attendance.personnelName
    ? ` - ${attendance.personnelName} (${formatTime(
        attendance.timeOfRegistration!
      )})`
    : "");

export interface Class {
  groupName: string;
  teacherName: string;
  attendances: Attendance[];
}
function formatTime(timeOfRegistration: string) {
  const date = new Date(timeOfRegistration);
  return `${date.getDate()}/${date.getMonth()} om ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function addExtraData(attendance: Attendance): Attendance {
  return {
    studentName: attendance.studentName,
    status: attendance.status,
    date: attendance.date,
    personnelName: attendance.personnelName,
    timeOfRegistration: attendance.timeOfRegistration,
    note: attendance.note || "",
    savedNote: attendance.note || "",
    savedStatus: attendance.status,
  };
}

export const isUnsaved = (attendance: Attendance) =>
  attendance.status != Status.NOT_REGISTERED_YET &&
  (attendance.note != attendance.savedNote ||
    attendance.status != attendance.savedStatus);

export const unsavedAttendancesExist = (chosenClass: Class) =>
  chosenClass.attendances.some((attendance) => isUnsaved(attendance));
