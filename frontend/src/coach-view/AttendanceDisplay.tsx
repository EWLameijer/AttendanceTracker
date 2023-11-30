import { useEffect, useState } from 'react';
import { Attendance, displayAttendance } from '../Class.ts';
import axios from 'axios';
import { BASE_URL, format, isValidAbbreviation, toStatusAbbreviation, toYYYYMMDD } from '../utils.ts';
import { useNavigate } from 'react-router-dom';
import "../styles.css"

const AttendanceDisplay = (props: { attendance: Attendance, personnelName: string, isCoach: boolean, updateAttendance: (attendance: Attendance) => void }) => {
    const [attendance, setAttendance] = useState<Attendance>(props.attendance);
    const navigate = useNavigate();
    useEffect(() => setAttendance(props.attendance), [props.attendance])

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const statusAbbreviation = attendance.currentStatusAbbreviation ?? "";
        if (!attendance.currentStatusAbbreviation) return;
        if (!isValidAbbreviation(statusAbbreviation)) {
            alert(`Afkorting '${statusAbbreviation}' is onbekend.`)
            return
        }

        const formattedStatus = format(statusAbbreviation)
        const newAttendance: Attendance = {
            studentName: attendance.studentName,
            status: formattedStatus,
            personnelName: props.personnelName,
            date: toYYYYMMDD(new Date())
        }
        const note = attendance.note
        if (note) newAttendance.note = note;
        axios.post(`${BASE_URL}/attendances`, newAttendance).then(response => {
            const newAbbreviation = toStatusAbbreviation(response.data.status);
            setAttendance({ ...response.data, currentStatusAbbreviation: newAbbreviation, savedStatusAbbreviation: newAbbreviation, savedNote: note })
        });
    }

    const showHistory = () => navigate(`/students/${props.attendance.studentName}`);

    const changeStatus = (event: React.FormEvent<HTMLInputElement>) => {
        const newAttendance = { ...attendance, currentStatusAbbreviation: event.currentTarget.value };
        props.updateAttendance(newAttendance)
        setAttendance(newAttendance)
    }

    const changeNote = (event: React.FormEvent<HTMLInputElement>) => {
        const newAttendance = { ...attendance, note: event.currentTarget.value };
        props.updateAttendance(newAttendance);
        setAttendance(newAttendance);
    }

    return <li>
        {displayAttendance(attendance)}
        <div className='left-box'>
            <form onSubmit={submit}>
                <input type="text" value={attendance.currentStatusAbbreviation} onChange={changeStatus} />
                <input type="text" value={attendance.note} onChange={changeNote} placeholder="aantekeningen" />
                <input type="submit" disabled={!attendance.currentStatusAbbreviation ||
                    attendance.note == attendance.savedNote && attendance.currentStatusAbbreviation == attendance.savedStatusAbbreviation}
                    value="Opslaan"></input>
            </form>
            {props.isCoach ? <button onClick={showHistory}>Geschiedenis</button> : <></>}
        </div>
    </li>
}

export default AttendanceDisplay;