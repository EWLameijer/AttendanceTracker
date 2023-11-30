import axios from 'axios';
import { Attendance, Class, addExtraData } from '../Class.ts'
import { BASE_URL, format, isValidAbbreviation, toYYYYMMDD } from '../utils.ts';
import AttendanceDisplay from './AttendanceDisplay.tsx';
import { useState } from 'react';

const GroupElement = (props: {
    currentClass: Class, personnelName: string, isCoach: boolean
}) => {
    const [chosenClass, setChosenClass] = useState(props.currentClass)

    const updateAttendance = (updatedAttendance: Attendance) => {
        const studentIndex = chosenClass.attendances.findIndex(attendance => attendance.studentName === updatedAttendance.studentName)
        const newAttendances = [...chosenClass.attendances];
        newAttendances[studentIndex] = updatedAttendance;
        setChosenClass({ ...chosenClass!, attendances: newAttendances })
    }

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
            personnelName: props.personnelName,
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

    const isUnsaved = (attendance: Attendance) =>
        attendance.currentStatusAbbreviation && (attendance.note != attendance.savedNote || attendance.currentStatusAbbreviation != attendance.savedStatusAbbreviation)


    const saveAllNewentries = () =>
        props.currentClass.attendances.filter(attendance => isUnsaved(attendance)).forEach(attendance => saveAttendance(attendance))


    const checkForUnsaved = () =>
        props.currentClass.attendances.some(attendance => isUnsaved(attendance))

    return <>
        <h3>{chosenClass.groupName}{chosenClass.teacherName != props.personnelName ? ` (${chosenClass.teacherName})` : ''}</h3>
        <ol>{chosenClass.attendances
            .sort((a, b) => a.studentName.localeCompare(b.studentName))
            .map(attendance => <AttendanceDisplay key={attendance.studentName} attendance={attendance} personnelName={props.personnelName}
                isCoach={props.isCoach} updateAttendance={updateAttendance} storeAttendance={saveAttendance} />)}</ol>
        {!props.isCoach ? <button onClick={saveAllNewentries} disabled={!checkForUnsaved()}>Stuur alle nieuwe registraties door</button> : <></>}
    </>
}



export default GroupElement;