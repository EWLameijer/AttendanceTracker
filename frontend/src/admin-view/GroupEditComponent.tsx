import { useState } from "react";
import { Group } from "./Group";
import MemberEditComponent from "./MemberEditComponent";

const GroupEditComponent = (props: { group: Group }) => {
    const [students, setStudents] = useState(props.group.members);
    const group = props.group;

    const remove = (studentId: string) => setStudents(students.filter(student => student.id != studentId));

    return <li>{group.name}
        <ul>{students.sort((a, b) => a.name.localeCompare(b.name))
            .map(member => <MemberEditComponent key={member.name} member={member} remove={remove} />)}</ul>
    </li>
}

export default GroupEditComponent;