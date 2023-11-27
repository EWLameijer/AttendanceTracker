import { Group } from "./Group";
import MemberEditComponent from "./MemberEditComponent";

const GroupEditComponent = (props: { group: Group }) => {
    const group = props.group;

    return <li>{group.name}
        <ul>{group.members.sort((a, b) => a.name.localeCompare(b.name)).map(member => <MemberEditComponent key={member.name} member={member} />)}</ul>
    </li>
}

export default GroupEditComponent;