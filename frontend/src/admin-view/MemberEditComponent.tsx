import { Student } from "./Student"

const MemberEditComponent = (props: { member: Student }) => {
    const remove = () => {
        console.log(`Removing ${props.member.name}`);
        const confirmation = confirm(`Wilt u echt ${props.member.name} uit de groep verwijderen?`);
        if (confirmation) {
            // todo: patch with "" groupId
        }
    }

    return <li>{props.member.name}<button onClick={remove}>Remove</button></li>
}

export default MemberEditComponent;