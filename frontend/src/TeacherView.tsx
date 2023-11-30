import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, Status, addExtraData } from './Class';
import GroupElement from './coach-view/GroupElement';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from './utils';

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


    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <button onClick={setAllUnregisteredAsPresent}>Zet alle ongeregistreerden op aanwezig</button>
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' isCoach={false} />

    </> : <p>Overzicht wordt geladen...</p>
}

export default TeacherView;

function addExtraAttendanceData(attendances: Attendance[]): Attendance[] {
    return attendances.map(attendance => addExtraData(attendance))
}

