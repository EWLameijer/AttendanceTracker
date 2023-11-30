import { useEffect, useState } from 'react';
import { Attendance, displayAttendance } from '../Class.ts';
import { useNavigate } from 'react-router-dom';
import "../styles.css"

const AttendanceDisplay = (props: {
    attendance: Attendance,
    personnelName: string,
    isCoach: boolean,
    updateAttendance: (attendance: Attendance) => void
    storeAttendance: (attendance: Attendance) => void,
}) => {
    const [attendance, setAttendance] = useState<Attendance>(props.attendance);
    const navigate = useNavigate();

    useEffect(() => setAttendance(props.attendance), [props.attendance])

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.storeAttendance(attendance);
    }

    const showHistory = () => navigate(`/students/${props.attendance.studentName}`);

    const changeItem = (event: React.FormEvent<HTMLInputElement>) => {
        const newAttendance = { ...attendance, [event.currentTarget.name]: event.currentTarget.value };
        props.updateAttendance(newAttendance);
        setAttendance(newAttendance);
    }

    return <li>
        {displayAttendance(attendance)}
        <div className='left-box'>
            <form onSubmit={submit}>
                <input type="text" value={attendance.currentStatusAbbreviation} name="currentStatusAbbreviation" onChange={changeItem} />
                <input type="text" value={attendance.note} name="note" onChange={changeItem} placeholder="aantekeningen" />
                <input type="submit" disabled={!attendance.currentStatusAbbreviation ||
                    attendance.note == attendance.savedNote && attendance.currentStatusAbbreviation == attendance.savedStatusAbbreviation}
                    value="Opslaan"></input>
            </form>
            {props.isCoach ? <button onClick={showHistory}>Geschiedenis</button> : <></>}
        </div>
    </li>
}

export default AttendanceDisplay;