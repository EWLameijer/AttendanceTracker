import { useContext, useState } from "react";
import { Group } from "../-shared/Group";
import MemberEditComponent from "./MemberEditComponent";
import axios from "axios";
import { BASE_URL } from "../-shared/utils";
import UserContext from "../-shared/UserContext";

const GroupEditComponent = ({
  group,
  remove,
  changeName,
}: {
  group: Group;
  remove: (id: string) => void;
  changeName: (id: string, newName: string) => void;
}) => {
  const [students, setStudents] = useState(group.members);
  const [newStudentName, setNewStudentName] = useState("");
  const user = useContext(UserContext);
  const [isEditMode, setEditMode] = useState(false);
  const [name, setName] = useState(group.name);

  const removeStudent = (studentId: string) =>
    setStudents(students.filter((student) => student.id != studentId));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = newStudentName.trim();
    axios
      .post(
        `${BASE_URL}/students`,
        {
          name: trimmedName,
          groupId: group.id,
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

  const removeGroupIfPermitted = () => {
    const really = confirm(
      `Wilt u echt '${group.name}' ${
        group.hasPastClasses ? "archiveren" : "verwijderen"
      }?`
    );
    if (really) {
      remove(group.id);
    }
  };

  const change = (event: React.FormEvent<HTMLInputElement>) =>
    setNewStudentName(event.currentTarget.value);

  const editOrSave = () => {
    if (isEditMode) {
      changeName(group.id, name);
      setName(group.name);
    }
    setEditMode(!isEditMode);
  };

  const stopEditing = () => {
    setEditMode(false);
    setName(group.name);
  };

  return (
    <li>
      {isEditMode ? (
        <input value={name} onChange={(e) => setName(e.currentTarget.value)} />
      ) : (
        <span>{name}</span>
      )}
      <button
        onClick={editOrSave}
        disabled={
          isEditMode && (!name?.trim() || name?.trim() === group.name.trim())
        }
      >
        {isEditMode ? "Opslaan" : "Groepsnaam wijzigen"}
      </button>
      {isEditMode && <button onClick={stopEditing}>Stop met wijzigen</button>}
      <button onClick={removeGroupIfPermitted}>
        {group.hasPastClasses ? "Archiveer groep" : "Verwijder groep"}
      </button>
      <ul>
        {students
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((member) => (
            <MemberEditComponent
              key={member.name}
              member={member}
              remove={removeStudent}
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
