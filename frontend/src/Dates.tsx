import axios from 'axios';
import { useState, useEffect } from 'react';

interface Attendance {
    name: string,
    status: string
}

const Dates = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    useEffect(() => {
        axios.get("http://localhost:8080/days/2023-11-27").then(response => {
            setAttendances(response.data.attendances);
        });
    }, []);

    return <ol>{attendances.map(attendance => <li key={attendance.name}>{attendance.name}: {attendance.status} </li>)}</ol>
}

export default Dates;