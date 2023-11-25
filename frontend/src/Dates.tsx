import axios from 'axios';
import { useState, useEffect } from 'react';
import { Group } from './Group';
import GroupElement from './GroupElement';


const capitalize = (text: string) => text[0].toUpperCase() + text.substring(1)

const Dates = () => {
    const [groups, setGroups] = useState<Group[]>([])
    const [date, setDate] = useState<Date | undefined>()

    useEffect(() => {
        axios.get('http://localhost:8080/days/2023-11-27').then(response => {
            setDate(new Date(response.data.date))
            setGroups(response.data.groups);
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
            < h2 > {capitalize(date.toLocaleDateString("nl-NL", options))}</h2 >
            <ol>{groups.map(group => <li key={group.name}><GroupElement group={group} /></li>)}</ol>
        </>
        : <p>Loading...</p>
}

export default Dates;