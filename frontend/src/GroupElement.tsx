import { Class } from './Class.ts'
import AttendanceDisplay from './AttendanceDisplay.tsx';


const GroupElement = (props: { currentClass: Class, personnelName: string }) => <>
    <h3>{props.currentClass.groupName}{props.currentClass.teacherName != props.personnelName ? ` (${props.currentClass.teacherName})` : ''}</h3>
    <ol>{props.currentClass.attendances
        .sort((a, b) => a.studentName.localeCompare(b.studentName))
        .map(attendance => <AttendanceDisplay key={attendance.studentName} attendance={attendance} personnelName={props.personnelName} />)}</ol>
</>

export default GroupElement;