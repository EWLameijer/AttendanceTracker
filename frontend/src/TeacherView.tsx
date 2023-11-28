import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class } from './Class';
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

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' isCoach={false} />
    </> : <p>Loading...</p>
}

export default TeacherView;