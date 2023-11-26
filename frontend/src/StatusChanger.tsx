import { useState } from 'react';
import { Attendance } from './Group.ts'

const toStatusAbbreviation = (statusText: string) => ({
    "ABSENT_WITH_NOTICE": "am",
    "ABSENT_WITHOUT_NOTICE": "az",
    "NOT REGISTERED YET": "",
    "PRESENT": "p",
    "SICK": "z",
    "WORKING_FROM_HOME": "t"
}[statusText] ?? statusText)

const StatusChanger = (props: { attendance: Attendance }) => {
    const [statusAbbreviation, setStatusAbbreviation] = useState<string>(toStatusAbbreviation(props.attendance.status))

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(statusAbbreviation);
        // post(item).then(() => {
        //     setItem({ ...defaultState });
        //     props.reloadItems();
        // })
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