import { useState } from "react";
import { Group } from "./Group";
import MemberEditComponent from "./MemberEditComponent";
import axios from "axios";
import { BASE_URL } from "../utils";

const GroupEditComponent = (props: { group: Group }) => {
    const [students, setStudents] = useState(props.group.members);
    const [newStudentName, setNewStudentName] = useState("")
    const group = props.group;

    const remove = (studentId: string) => setStudents(students.filter(student => student.id != studentId));

    const submit = () => {
        const trimmedName = newStudentName.trim();
        axios.post(`${BASE_URL}/students`, {
            name: trimmedName,
            groupId: props.group.id
        }).then(response => {
            setStudents([...students, response.data])
            setNewStudentName("");
        }).catch(() => {
            alert(`Student '${trimmedName}' bestaat al!`);
        });
    }

    const change = (event: React.FormEvent<HTMLInputElement>) => setNewStudentName(event.currentTarget.value)

    return <li>{group.name}
        <ul>{students.sort((a, b) => a.name.localeCompare(b.name))
            .map(member => <MemberEditComponent key={member.name} member={member} remove={remove} />)}</ul>
        <form onSubmit={submit}>
            <input type="text" value={newStudentName} onChange={change} />
            <input type="submit" value="Voeg toe" disabled={!newStudentName.trim()}></input>
        </form>

    </li>
}

export default GroupEditComponent;