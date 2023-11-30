import { useState } from 'react';
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

const isValidAbbreviation = (abbreviation: string) => {
    const statusAbbreviations = statusToAbbreviation.values();
    if ([...statusAbbreviations].includes(abbreviation.toLocaleLowerCase())) return true;
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
    return ([...statusToAbbreviation.entries()].find(entry => entry[1] == abbreviation))![0];
}

const AttendanceDisplay = (props: { attendance: Attendance, personnelName: string, isCoach: boolean }) => {
    const [statusAbbreviation, setStatusAbbreviation] = useState<string>(toStatusAbbreviation(props.attendance.status))
    const [attendance, setAttendance] = useState<Attendance>(props.attendance);
    const [savedStatusAbbreviation, setSavedStatusAbbreviation] = useState(toStatusAbbreviation(props.attendance.status));
    const navigate = useNavigate();

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!statusAbbreviation) return;
        if (!isValidAbbreviation(statusAbbreviation)) {
            alert(`Afkorting '${statusAbbreviation}' is onbekend.`)
            return
        }

        const formattedStatus = format(statusAbbreviation)
        axios.post(`${BASE_URL}/attendances`, {
            studentName: attendance.studentName,
            status: formattedStatus,
            personnelName: props.personnelName,
            date: toYYYYMMDD(new Date())
        }).then(response => {
            const newAbbreviation = toStatusAbbreviation(response.data.status);
            setStatusAbbreviation(newAbbreviation);
            setSavedStatusAbbreviation(newAbbreviation)
            setAttendance(response.data)
        });
    }

    const showHistory = () => navigate(`/students/${props.attendance.studentName}`);

    const change = (event: React.FormEvent<HTMLInputElement>) => setStatusAbbreviation(event.currentTarget.value)

    return <li>
        {displayAttendance(attendance)}
        <div className='left-box'>
            <form onSubmit={submit}>
                <input type="text" value={statusAbbreviation} onChange={change} />
                <input type="submit" disabled={!statusAbbreviation.trim() || statusAbbreviation == savedStatusAbbreviation}
                    value="Opslaan"></input>
            </form>
            {props.isCoach ? <button onClick={showHistory}>Geschiedenis</button> : <></>}
        </div>
    </li>
}

export default AttendanceDisplay;