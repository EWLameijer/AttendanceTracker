import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class } from '../Class';
import GroupElement from './GroupElement';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from '../utils';

const CoachView = () => {
    const [classes, setClasses] = useState<Class[]>([])
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get(`${BASE_URL}/coach-view/juan/dates/${toYYYYMMDD(new Date())}`).then(response => {
            setDate(new Date(response.data[0].dateAsString))
            setClasses(response.data);
        });
    }, []);

    return date ?
        <>
            <h2>Hallo Juan!</h2>
            <h3>{capitalize(date.toLocaleDateString("nl-NL", dateOptions))}</h3 >
            <ol>{classes.sort((a, b) => a.groupName.localeCompare(b.groupName)).map(currentClass =>
                <li key={currentClass.groupName}><GroupElement currentClass={currentClass} personnelName='Juan' isCoach={true} updateAttendance={() => { }} /></li>)}</ol>
        </>
        : <p>Loading...</p>
}

export default CoachView;