import axios from "axios";
import { Student } from "../-shared/Student";
import { BASE_URL } from "../-shared/utils";
import UserContext from "../-shared/UserContext";
import { useContext } from "react";

const EditMember = ({
  member,
  removeMember,
}: {
  member: Student;
  removeMember: (id: string) => void;
}) => {
  const user = useContext(UserContext);

  const remove = () => {
    const confirmation = confirm(
      `Wilt u echt ${member.name} uit de groep verwijderen?`
    );
    if (confirmation) {
      axios
        .patch(
          `${BASE_URL}/students`,
          { id: member.id, groupId: "" },
          { auth: { username: user.username, password: user.password } }
        )
        .then(() => {
          removeMember(member.id);
          alert(`${member.name} verwijderd.`);
        });
    }
  };

  return (
    <li>
      {member.name}
      <button onClick={remove}>Verwijder</button>
    </li>
  );
};

export default EditMember;
