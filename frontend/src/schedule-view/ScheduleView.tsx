import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClass } from "./ScheduledClass";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [apiWerkt, setApiWerkt] = useState<string>();
  const [apiWerkt2, setApiWerkt2] = useState<string>();
  const [dateAsString, setDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
      setTeacherId(response.data[0].id);
      setApiWerkt("nee");
      setApiWerkt2("nog niets");
    });

    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
      setGroupId(response.data[0].id);
    });
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateAsString(event.target.value);
  };

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTeacherId(value);
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setGroupId(value);
  };

  const submitButton = document.getElementById("submitBtn");
  submitButton?.addEventListener("click", (event) => event.preventDefault());

  const submit = () => {
    axios
      .post<ScheduledClass>(`${BASE_URL}/scheduled-class`, {
        groupId,
        teacherId,
        dateAsString,
      })
      .then((response) => {
        const returnedStatus = response.status;

        setApiWerkt(returnedStatus.toString());
      })
      .catch((err) => {
        const returnedError = err.response;

        setApiWerkt(returnedError.status.toString());
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
            <option key={index} value={teacher.id}>
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

      <p>{apiWerkt}</p>
      <p>{apiWerkt2}</p>
    </form>
  );
};

export default ScheduleView;
