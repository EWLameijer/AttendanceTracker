import { Group } from './Group.ts'
import StatusChanger from './AttendanceDisplay.tsx';


const GroupElement = (props: { group: Group }) => <>
    <h3>{props.group.name}</h3>
    <ol>{props.group.attendances
        .sort((a, b) => a.studentName.localeCompare(b.studentName))
        .map(attendance => <StatusChanger key={attendance.studentName} attendance={attendance} />)}</ol>
</>

export default GroupElement;