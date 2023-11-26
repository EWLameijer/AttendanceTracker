import { Class } from './Class.ts'
import StatusChanger from './AttendanceDisplay.tsx';


const GroupElement = (props: { currentClass: Class }) => <>
    <h3>{props.currentClass.groupName} ({props.currentClass.teacherName})</h3>
    <ol>{props.currentClass.attendances
        .sort((a, b) => a.studentName.localeCompare(b.studentName))
        .map(attendance => <StatusChanger key={attendance.studentName} attendance={attendance} />)}</ol>
</>

export default GroupElement;