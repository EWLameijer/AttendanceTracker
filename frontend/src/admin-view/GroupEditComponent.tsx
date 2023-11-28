import { useState } from "react";
import { Group } from "./Group";
import MemberEditComponent from "./MemberEditComponent";

const GroupEditComponent = (props: { group: Group }) => {
    const [students, setStudents] = useState(props.group.members);
    const [newStudentName, setNewStudentName] = useState("")
    const group = props.group;

    const remove = (studentId: string) => setStudents(students.filter(student => student.id != studentId));

    const submit = () => { }

    const change = (event: React.FormEvent<HTMLInputElement>) => setNewStudentName(event.currentTarget.value)

    return <li>{group.name}
        <ul>{students.sort((a, b) => a.name.localeCompare(b.name))
            .map(member => <MemberEditComponent key={member.name} member={member} remove={remove} />)}</ul>
        <form onSubmit={submit}>
            <input type="text" value={newStudentName} onChange={change} />
            <input type="submit" value="Voeg toe"></input>
        </form>

    </li>
}

export default GroupEditComponent;