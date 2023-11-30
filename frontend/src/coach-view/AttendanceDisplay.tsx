import { useEffect, useState } from 'react';
import { Attendance, displayAttendance } from '../Class.ts';
import axios from 'axios';
import { BASE_URL, toYYYYMMDD } from '../utils.ts';
import { useNavigate } from 'react-router-dom';
import "../styles.css"

const statusToAbbreviation = new Map<string, string>([
    ["ABSENT_WITH_NOTICE", "am"],
    ["ABSENT_WITHOUT_NOTICE", "az"],
    ["NOT REGISTERED YET", ""],
    ["PRESENT", "p"],
    ["SICK", "z"],
    ["WORKING_FROM_HOME", "t"]
]);

const toStatusAbbreviation = (statusText: string) => statusToAbbreviation.get(statusText) ?? statusText;

const standardize = (text: string) => text.trim().toLocaleLowerCase()

const isValidAbbreviation = (abbreviation: string) => {
    const statusAbbreviations = statusToAbbreviation.values();
    if ([...statusAbbreviations].includes(standardize(abbreviation))) return true;
    const digits = extractDigits(abbreviation);
    return digits.length == 4 && digits[0] == '1' && digits[1] <= '5' && digits[2] <= '5';
}

const extractDigits = (text: string) => text.split("").filter(a => a >= '0' && a <= '9');

const format = (abbreviation: string) => {
    const digits = extractDigits(abbreviation);
    if (digits.length == 4) {
        digits.splice(2, 0, ":") // as of 20231126, toSpliced not available in current TypeScript version
        return digits.join("");
    }
    return ([...statusToAbbreviation.entries()].find(entry => entry[1] == standardize(abbreviation)))![0];
}

const AttendanceDisplay = (props: { attendance: Attendance, personnelName: string, isCoach: boolean }) => {
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

    const changeStatus = (event: React.FormEvent<HTMLInputElement>) => setAttendance({ ...attendance, currentStatusAbbreviation: event.currentTarget.value })

    const changeNote = (event: React.FormEvent<HTMLInputElement>) => setAttendance({ ...attendance, note: event.currentTarget.value })

    return <li>
        {displayAttendance(attendance)}
        <div className='left-box'>
            <form onSubmit={submit}>
                <input type="text" value={attendance.currentStatusAbbreviation} onChange={changeStatus} />
                <input type="text" value={attendance.note} onChange={changeNote} placeholder="aantekeningen" />
                <input type="submit" disabled={
                    attendance.note == attendance.savedNote && attendance.currentStatusAbbreviation == attendance.savedStatusAbbreviation}
                    value="Opslaan"></input>
            </form>
            {props.isCoach ? <button onClick={showHistory}>Geschiedenis</button> : <></>}
        </div>
    </li>
}

export default AttendanceDisplay;