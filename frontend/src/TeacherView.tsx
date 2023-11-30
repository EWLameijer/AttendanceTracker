import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, addExtraData } from './Class';
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

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <GroupElement chosenClass={chosenClass} personnelName='Wubbo' isCoach={false} />
    </> : <p>Overzicht wordt geladen...</p>
}

export default TeacherView;

function addExtraAttendanceData(attendances: Attendance[]): Attendance[] {
    return attendances.map(attendance => addExtraData(attendance))
}

