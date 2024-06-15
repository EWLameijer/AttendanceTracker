import axios from "axios";
import { Student } from "../shared/Student";
import { BASE_URL } from "../shared/utils";
import UserContext from "../login-page/UserContext";
import { useContext } from "react";

const MemberEditComponent = (props: {
  member: Student;
  remove: (id: string) => void;
}) => {
  const user = useContext(UserContext);

  const remove = () => {
    const confirmation = confirm(
      `Wilt u echt ${props.member.name} uit de groep verwijderen?`
    );
    if (confirmation) {
      axios
        .patch(
          `${BASE_URL}/students`,
          { id: props.member.id, groupId: "" },
          { auth: { username: user.username, password: user.password } }
        )
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
