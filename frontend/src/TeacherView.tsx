import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, Status, addExtraData } from './Class';
import GroupElement from './coach-view/GroupElement';
import { BASE_URL, capitalize, dateOptions, format, isValidAbbreviation, toYYYYMMDD } from './utils';

const TeacherView = () => {
    const [chosenClass, setChosenClass] = useState<Class>()
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get(`${BASE_URL}/teacher-view/wubbo/dates/${toYYYYMMDD(new Date())}`).then(response => {
            const updatedAttendances = addExtraAttendanceData(response.data.attendances);
            setChosenClass({ ...response.data, attendances: updatedAttendances });
            setDate(new Date(response.data.dateAsString))
        });
    }, []);

    const setUnregisteredAsPresent = (attendance: Attendance): Attendance => {
        const newAttendance = { ...attendance };
        if (newAttendance.status == Status.NOT_REGISTERED_YET && !newAttendance.savedStatusAbbreviation) {
            newAttendance.currentStatusAbbreviation = 'p';
        }
        return newAttendance;
    }

    const setAllUnregisteredAsPresent = () => {
        const newAttendances = chosenClass!.attendances.map(attendance => setUnregisteredAsPresent(attendance))
        setChosenClass({ ...chosenClass!, attendances: newAttendances });
    }

    const isUnsaved = (attendance: Attendance) =>
        attendance.currentStatusAbbreviation && (attendance.note != attendance.savedNote || attendance.currentStatusAbbreviation != attendance.savedStatusAbbreviation)

    const saveAllNewentries = () =>
        chosenClass!.attendances.filter(attendance => isUnsaved(attendance)).forEach(attendance => saveAttendance(attendance))

    const saveAttendance = (attendance: Attendance) => {
        const statusAbbreviation = attendance.currentStatusAbbreviation ?? "";
        if (!attendance.currentStatusAbbreviation) return;
        if (!isValidAbbreviation(statusAbbreviation)) {
            alert(`Afkorting '${statusAbbreviation}' is onbekend.`)
            return
        }

        const formattedStatus = format(statusAbbreviation)
        const newAttendance: Attendance = {
            studentName: attendance.studentName,
            status: formattedStatus,
            personnelName: chosenClass!.teacherName,
            date: toYYYYMMDD(new Date())
        }
        const note = attendance.note
        if (note) newAttendance.note = note;
        axios.post(`${BASE_URL}/attendances`, newAttendance).then(response => {
            const basicAttendance = response.data;
            const extendedAttendance = addExtraData(basicAttendance);
            updateAttendance(extendedAttendance);
        });
    }

    const checkForUnsaved = () =>
        chosenClass!.attendances.some(attendance => isUnsaved(attendance))

    const updateAttendance = (updatedAttendance: Attendance) => {
        const studentIndex = chosenClass!.attendances.findIndex(attendance => attendance.studentName === updatedAttendance.studentName)
        const newAttendances = [...chosenClass!.attendances];
        newAttendances[studentIndex] = updatedAttendance;
        setChosenClass({ ...chosenClass!, attendances: newAttendances })
    }

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <button onClick={setAllUnregisteredAsPresent}>Zet alle ongeregistreerden op aanwezig</button>
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' isCoach={false} updateAttendance={updateAttendance} />
        <button onClick={saveAllNewentries} disabled={!checkForUnsaved()}>Stuur alle nieuwe registraties door</button>
    </> : <p>Loading...</p>
}

export default TeacherView;

function addExtraAttendanceData(attendances: Attendance[]): Attendance[] {
    return attendances.map(attendance => addExtraData(attendance))
}

