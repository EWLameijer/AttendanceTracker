export interface Attendance {
    studentName: string,
    status: string,
    date: string,
    personnelName: string,
    timeOfRegistration?: string,
    note?: string
}

export const translateAttendanceStatus = (status: string) => ({
    "ABSENT_WITH_NOTICE": "afwezig met bericht",
    "ABSENT_WITHOUT_NOTICE": "AFWEZIG ZONDER BERICHT",
    "NOT REGISTERED YET": "NOG NIET GEREGISTREERD",
    "PRESENT": "aanwezig",
    "SICK": "ziek",
    "WORKING_FROM_HOME": "werkt thuis"
}[status] ?? "TE LAAT - " + status)

export const displayAttendance = (attendance: Attendance) =>
    `${attendance.studentName}: ${translateAttendanceStatus(attendance.status)}` +
    (attendance.personnelName ? ` - ${attendance.personnelName} (${formatTime(attendance.timeOfRegistration!)})` : "");

export interface Class {
    groupName: string,
    teacherName: string,
    attendances: Attendance[]
}
function formatTime(timeOfRegistration: string) {
    const date = new Date(timeOfRegistration);
    return `${date.getDate()}/${date.getMonth()} om ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

