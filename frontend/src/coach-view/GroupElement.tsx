import axios from 'axios';
import { Attendance, Class, addExtraData, isUnsaved, unsavedAttendancesExist } from '../Class.ts'
import { BASE_URL, format, isValidAbbreviation, toYYYYMMDD } from '../utils.ts';
import AttendanceDisplay from './AttendanceDisplay.tsx';
import { useEffect, useState } from 'react';

const GroupElement = (props: {
    chosenClass: Class, personnelName: string, isCoach: boolean, dateAsString: string
}) => {
    const [chosenClass, setChosenClass] = useState(props.chosenClass)
    useEffect(() => setChosenClass(props.chosenClass), [props.chosenClass])

    const updateAttendance = (updatedAttendances: Attendance[]) => {
        const newAttendances = [...chosenClass.attendances];
        for (const updatedAttendance of updatedAttendances) {
            const studentIndex = chosenClass.attendances.findIndex(attendance => attendance.studentName === updatedAttendance.studentName)
            newAttendances[studentIndex] = updatedAttendance;
        }
        setChosenClass({ ...chosenClass!, attendances: newAttendances })
    }

    const saveAttendances = (attendances: Attendance[]) => {
        for (const attendance of attendances) {
            const statusAbbreviation = attendance.currentStatusAbbreviation ?? "";
            if (!attendance.currentStatusAbbreviation) return;
            if (!isValidAbbreviation(statusAbbreviation)) {
                alert(`Afkorting '${statusAbbreviation}' is onbekend.`)
                return
            }
        }

        const formattedAttendances = attendances.map(attendance => {
            const formattedStatus = format(attendance.currentStatusAbbreviation ?? "")
            const newAttendance: Attendance = {
                studentName: attendance.studentName,
                status: formattedStatus,
                personnelName: props.personnelName,
                date: props.dateAsString
            }
            const note = attendance.note
            if (note) newAttendance.note = note;
            return newAttendance
        });

        axios.post<Attendance[]>(`${BASE_URL}/attendances`, formattedAttendances).then(response => {
            const basicAttendances = response.data;
            const extendedAttendances = basicAttendances.map(attendance => addExtraData(attendance));
            updateAttendance(extendedAttendances);
        });
    }

    const setUnregisteredAsPresent = (attendance: Attendance): Attendance => {
        const newAttendance = { ...attendance };
        if (!newAttendance.savedStatusAbbreviation) {
            newAttendance.currentStatusAbbreviation = 'p';
        }
        return newAttendance;
    }

    const saveAllNewentries = () =>
        saveAttendances(chosenClass.attendances.filter(attendance => isUnsaved(attendance)))

    const setAllUnregisteredAsPresent = () => {
        const newAttendances = chosenClass!.attendances.map(attendance => setUnregisteredAsPresent(attendance))
        setChosenClass({ ...chosenClass!, attendances: newAttendances });
    }

    const unregisteredAttendancesExist = () => chosenClass!.attendances.some(attendance => !attendance.currentStatusAbbreviation)

    return <>
        <h3>{chosenClass.groupName}{chosenClass.teacherName != props.personnelName ? ` (${chosenClass.teacherName})` : ''}</h3>
        {!props.isCoach ? <button onClick={setAllUnregisteredAsPresent} disabled={!unregisteredAttendancesExist()}>Zet alle ongeregistreerden op aanwezig</button> : <></>}
        <ol>{chosenClass.attendances
            .sort((a, b) => a.studentName.localeCompare(b.studentName))
            .map(attendance => <AttendanceDisplay key={attendance.studentName} attendance={attendance} personnelName={props.personnelName}
                isCoach={props.isCoach} updateAttendance={updateAttendance} saveAttendances={saveAttendances} />)}</ol>
        {!props.isCoach ? <button onClick={saveAllNewentries} disabled={!unsavedAttendancesExist(chosenClass)}>Stuur alle nieuwe registraties door</button> : <></>}
    </>
}

export default GroupElement;