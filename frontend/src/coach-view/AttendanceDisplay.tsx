import { useState } from 'react';
import { Attendance, displayAttendance } from '../Class.ts';
import axios from 'axios';
import { BASE_URL } from '../utils.ts';

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

const AttendanceDisplay = (props: { attendance: Attendance, personnelName: string }) => {
    const [statusAbbreviation, setStatusAbbreviation] = useState<string>(toStatusAbbreviation(props.attendance.status))
    const [attendance, setAttendance] = useState<Attendance>(props.attendance);

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
            date: "2023-11-27"
        }).then(response => {
            setStatusAbbreviation(toStatusAbbreviation(response.data.status));
            setAttendance(response.data)
        });
    }

    const change = (event: React.FormEvent<HTMLInputElement>) => setStatusAbbreviation(event.currentTarget.value)

    return <li>
        {displayAttendance(attendance)}
        <form onSubmit={submit}>
            <input type="text" value={statusAbbreviation} onChange={change} />
            <input type="submit" disabled={!statusAbbreviation.trim()}></input>
        </form>
    </li>
}

export default AttendanceDisplay;