interface Attendance {
    name: string,
    status: string
}

const translateAttendanceStatus = (status: string) => ({
    "ABSENT_WITH_NOTICE": "afwezig met bericht",
    "ABSENT_WITHOUT_NOTICE": "AFWEZIG ZONDER BERICHT",
    "NOT REGISTERED YET": "NOG NIET GEREGISTREERD",
    "PRESENT": "aanwezig",
    "SICK": "ziek",
    "WORKING_FROM_HOME": "werkt thuis"
}[status] ?? "TE LAAT - " + status)

export const displayAttendance = (attendance: Attendance) => attendance.name + ": " + translateAttendanceStatus(attendance.status)

export interface Group {
    name: string,
    attendances: Attendance[]
}
