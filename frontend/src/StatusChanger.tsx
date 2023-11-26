import { useState } from 'react';
import { Attendance } from './Group.ts';
import axios from 'axios';

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
    const digits = abbreviation.split("").filter(a => a >= '0' && a <= '9')
    return digits.length == 4 && digits[0] == '1' && digits[1] <= '5' && digits[2] <= '5';
}

const format = (abbreviation: string) => {
    const digits = abbreviation.split("").filter(a => a >= '0' && a <= '9');
    if (digits.length == 4) {
        digits.splice(2, 0, ":")
        return digits.join("");
    }
    const fulltext = [...statusToAbbreviation.entries()].find(entry => entry[1] == abbreviation);
    return fulltext![0];
}

const StatusChanger = (props: { attendance: Attendance }) => {
    const [statusAbbreviation, setStatusAbbreviation] = useState<string>(toStatusAbbreviation(props.attendance.status))

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!statusAbbreviation) return;
        if (!isValidAbbreviation(statusAbbreviation)) {
            alert(`Afkorting '${statusAbbreviation}' is onbekend.`)
        }

        const formattedStatus = format(statusAbbreviation)
        axios.post('http://localhost:8080/attendances', {
            studentName: props.attendance.name,
            status: formattedStatus,
            personnelName: "Juan",
            date: "2023-11-27"
        }).then(response => {
            setStatusAbbreviation(toStatusAbbreviation(response.data.status));
        });
    }

    const change = (event: React.FormEvent<HTMLInputElement>) => setStatusAbbreviation(event.currentTarget.value)

    return <>
        <form onSubmit={submit}>
            <input type="text" value={statusAbbreviation} onChange={change} />
            <input type="submit"></input>
        </form>
    </>
}

export default StatusChanger;