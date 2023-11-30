import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, Status } from './Class';
import GroupElement from './coach-view/GroupElement';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from './utils';

const TeacherView = () => {
    const [chosenClass, setChosenClass] = useState<Class>()
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get(`${BASE_URL}/teacher-view/wubbo/dates/${toYYYYMMDD(new Date())}`).then(response => {
            setChosenClass(response.data);
            setDate(new Date(response.data.dateAsString))
        });
    }, []);

    const setUnregisteredAsPresent = (attendance: Attendance): Attendance => {
        const newAttendance = { ...attendance };
        if (newAttendance.status == Status.NOT_REGISTERED_YET) newAttendance.status = Status.PRESENT;
        return newAttendance;
    }

    const setAllUnregisteredAsPresent = () => {
        const newAttendances = chosenClass!.attendances.map(attendance => setUnregisteredAsPresent(attendance))
        setChosenClass({ ...chosenClass!, attendances: newAttendances }); // this part works, the class is updated with Bas PRESENT
    }

    const saveAllNewentries = () => { }

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <button onClick={setAllUnregisteredAsPresent}>Zet alle ongeregistreerden op aanwezig</button>
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' isCoach={false} />
        <button onClick={saveAllNewentries}>Stuur alle nieuwe registraties door</button>
    </> : <p>Loading...</p>
}

export default TeacherView;