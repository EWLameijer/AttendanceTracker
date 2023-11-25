import { Group, displayAttendance } from './Group.ts'

const GroupElement = (props : {group: Group}) => <>
        <h3>{props.group.name}</h3>
        <ol>{props.group.attendances.map(attendance => <li key={attendance.name}>{displayAttendance(attendance)}</li>)}</ol>
    </>

export default GroupElement;