import axios from "axios";
import { Student } from "./Student"

const MemberEditComponent = (props: { member: Student, remove: (id: string) => void }) => {
    const remove = () => {
        console.log(`Removing ${props.member.name}`);
        const confirmation = confirm(`Wilt u echt ${props.member.name} uit de groep verwijderen?`);
        if (confirmation) {
            axios.patch('http://localhost:8080/students', { id: props.member.id, groupId: "" }).then(() => {
                props.remove(props.member.id);
            });
        }
    }

    return <li>{props.member.name}<button onClick={remove}>Remove</button></li>
}

export default MemberEditComponent;