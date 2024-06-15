import { useContext, useState } from "react";
import { Group } from "../shared/Group";
import MemberEditComponent from "./MemberEditComponent";
import axios from "axios";
import { BASE_URL } from "../utils";
import UserContext from "../login-page/UserContext";

const GroupEditComponent = (props: {
  group: Group;
  remove: (id: string) => void;
}) => {
  const [students, setStudents] = useState(props.group.members);
  const [newStudentName, setNewStudentName] = useState("");
  const group = props.group;
  const user = useContext(UserContext);

  const remove = (studentId: string) =>
    setStudents(students.filter((student) => student.id != studentId));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newStudentName.trim();
    axios
      .post(
        `${BASE_URL}/students`,
        {
          name: trimmedName,
          groupId: props.group.id,
        },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        setStudents([...students, response.data]);
        setNewStudentName("");
      })
      .catch(() => {
        alert(`Student '${trimmedName}' bestaat al!`);
      });
  };

  const removeGroup = () => {
    const really = confirm(`Wilt u echt '${props.group.name}' verwijderen?`);
    if (really) {
      props.remove(props.group.id);
    }
  };

  const change = (event: React.FormEvent<HTMLInputElement>) =>
    setNewStudentName(event.currentTarget.value);

  return (
    <li>
      {group.name}
      <button onClick={removeGroup}>Verwijder groep!</button>
      <ul>
        {students
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((member) => (
            <MemberEditComponent
              key={member.name}
              member={member}
              remove={remove}
            />
          ))}
      </ul>
      <form onSubmit={submit}>
        <input value={newStudentName} onChange={change} />
        <input
          type="submit"
          value="Voeg toe"
          disabled={!newStudentName.trim()}
        ></input>
      </form>
    </li>
  );
};

export default GroupEditComponent;
