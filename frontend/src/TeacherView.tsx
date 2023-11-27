import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class } from './Class';
import GroupElement from './GroupElement';
import { capitalize, dateOptions } from './utils';

const TeacherView = () => {
    const [chosenClass, setChosenClass] = useState<Class>()
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get('http://localhost:8080/teacher-view/wubbo/dates/2023-11-27').then(response => {
            setChosenClass(response.data);
            setDate(new Date(response.data.dateAsString))
        });
    }, []);

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <h3>{capitalize(date!.toLocaleDateString("nl-NL", dateOptions))}</h3 >
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' />
    </> : <p>Loading...</p>
}

export default TeacherView;