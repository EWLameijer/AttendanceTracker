import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClass } from "./ScheduledClass";
import UserContext from "../context/UserContext";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherName, setTeacherName] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [dateAsString, setDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const user = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/workers/teachers`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setTeachers(response.data);
        setTeacherName(response.data[0].name);
      });

    axios
      .get(`${BASE_URL}/groups`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setGroups(response.data);
        setGroupId(response.data[0].id);
      });
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDateAsString(event.target.value);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTeacherName(event.target.value);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setGroupId(event.target.value);

  const submitButton = document.getElementById("submitBtn");
  submitButton?.addEventListener("click", (event) => event.preventDefault());

  const submit = () => {
    axios
      .post<ScheduledClass>(
        `${BASE_URL}/scheduled-classes`,
        {
          groupId,
          teacherName,
          dateAsString,
        },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        if (response.status == HttpStatusCode.Created)
          alert("1 nieuwe les toegevoegd");
      })
      .catch((error) => {
        if (error.response.status == HttpStatusCode.BadRequest)
          alert("FOUT: Deze leraar heeft al een groep op deze dag");
        else alert(error.response.status + " " + error.response.data);
      });
  };

  return (
    <form>
      <h3>Voeg een nieuwe les toe:</h3>

      <p>
        Datum:
        <input
          id="inputDate"
          name="date"
          type="date"
          value={dateAsString.toString()}
          onChange={handleDateChange}
        ></input>
      </p>

      <p>
        Leraar:
        <select id="teacher" name="teacher" onChange={handleTeacherChange}>
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </select>
      </p>

      <p>
        Groep:
        <select id="group" name="group" onChange={handleGroupChange}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </p>

      <div>
        <button id="submitBtn" onClick={submit}>
          Opslaan
        </button>
      </div>
    </form>
  );
};

export default ScheduleView;
