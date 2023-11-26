export interface Attendance {
    name: string,
    status: string,
    by: string,
    timeOfRegistration: string
}

const translateAttendanceStatus = (status: string) => ({
    "ABSENT_WITH_NOTICE": "afwezig met bericht",
    "ABSENT_WITHOUT_NOTICE": "AFWEZIG ZONDER BERICHT",
    "NOT REGISTERED YET": "NOG NIET GEREGISTREERD",
    "PRESENT": "aanwezig",
    "SICK": "ziek",
    "WORKING_FROM_HOME": "werkt thuis"
}[status] ?? "TE LAAT - " + status)

export const displayAttendance = (attendance: Attendance) => 
    `${attendance.name}: ${translateAttendanceStatus(attendance.status)}` + (attendance.by ? ` - ${attendance.by} (${formatTime(attendance.timeOfRegistration)})` : ""); 

export interface Group {
    name: string,
    attendances: Attendance[]
}
function formatTime(timeOfRegistration: string) {
    const date = new Date(timeOfRegistration);
    return `${date.getDate()}/${date.getMonth()} om ${date.getHours()}:${date.getMinutes()}`
}

