import { Group, displayAttendance } from './Group.ts'
import StatusChanger from './StatusChanger.tsx';


const GroupElement = (props: { group: Group }) => <>
    <h3>{props.group.name}</h3>
    <ol>{props.group.attendances
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(attendance => <li key={attendance.name}>{displayAttendance(attendance)}<StatusChanger attendance={attendance} /></li>)}</ol>
</>

export default GroupElement;