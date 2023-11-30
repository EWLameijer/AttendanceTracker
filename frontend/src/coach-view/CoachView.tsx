import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class, addExtraData } from '../Class';
import GroupElement from './GroupElement';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from '../utils';

const CoachView = () => {
    const [classes, setClasses] = useState<Class[]>([])
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get<Class[]>(`${BASE_URL}/coach-view/juan/dates/${toYYYYMMDD(new Date())}`).then(response => {
            setDate(new Date(response.data[0].attendances[0].date))
            const rawClasses = response.data;
            for (const rawClass of rawClasses) {
                const fullFormatAttendances = rawClass.attendances.map(attendance => addExtraData(attendance))
                rawClass.attendances = fullFormatAttendances
            }
            setClasses(rawClasses);
        });
    }, []);

    return date ?
        <>
            <h2>Hallo Juan!</h2>
            <h3>{capitalize(date.toLocaleDateString("nl-NL", dateOptions))}</h3 >
            <ol>{classes.sort((a, b) => a.groupName.localeCompare(b.groupName)).map(currentClass =>
                <li key={currentClass.groupName}><GroupElement chosenClass={currentClass} personnelName='Juan' isCoach={true} /></li>)}</ol>
        </>
        : <p>Overzicht wordt geladen...</p>
}

export default CoachView;
