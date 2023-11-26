import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class } from './Class';
import GroupElement from './GroupElement';


const capitalize = (text: string) => text[0].toUpperCase() + text.substring(1)

const Dates = () => {
    const [classes, setClasses] = useState<Class[]>([])
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get('http://localhost:8080/dates/2023-11-27').then(response => {
            setDate(new Date(response.data[0].dateAsString))
            setClasses(response.data);
        });
    }, []);

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return date ?
        <>
            <h2>Hallo Juan!</h2>
            <h3>{capitalize(date.toLocaleDateString("nl-NL", options))}</h3 >
            <ol>{classes.sort((a, b) => a.groupName.localeCompare(b.groupName)).map(currentClass =>
                <li key={currentClass.groupName}><GroupElement currentClass={currentClass} personnelName='Juan' /></li>)}</ol>
        </>
        : <p>Loading...</p>
}

export default Dates;