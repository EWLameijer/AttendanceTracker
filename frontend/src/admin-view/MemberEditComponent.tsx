import axios from "axios";
import { Student } from "./Student";
import { BASE_URL } from "../utils";

const MemberEditComponent = (props: {
  member: Student;
  remove: (id: string) => void;
}) => {
  const remove = () => {
    const confirmation = confirm(
      `Wilt u echt ${props.member.name} uit de groep verwijderen?`
    );
    if (confirmation) {
      axios
        .patch(`${BASE_URL}/students`, { id: props.member.id, groupId: "" })
        .then(() => {
          props.remove(props.member.id);
        });
    }
  };

  return (
    <li>
      {props.member.name}
      <button onClick={remove}>Verwijder</button>
    </li>
  );
};

export default MemberEditComponent;
