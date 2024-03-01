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
  const [dateAsString, setDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
      setTeacherId(response.data[0].id);
    });

    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
      setGroupId(response.data[0].id);
    });
  }, []);

  const handleDateChanged = (event: React.FormEvent<HTMLInputElement>) => {
    const newDateAsString = {
      dateAsString,
      [event.currentTarget.name]: event.currentTarget.value,
    };
    setDateAsString(newDateAsString.dateAsString);
  };

  const handleSelectedTeacher = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setTeacherId(value);
  };

  const handleSelectedGroup = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setGroupId(value);
  };

  const submit = () => {
    axios
      .post<ScheduledClass>(`${BASE_URL}/scheduled-class`, {
        groupId,
        teacherId,
        dateAsString,
      })
      .then(() => {})
      .catch(() => {});
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
          onChange={handleDateChanged}
        ></input>
      </p>

      <p>
        Leraar:
        <select id="teacher" name="teacher" onChange={handleSelectedTeacher}>
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </p>

      <p>
        Groep:
        <select id="group" name="group" onChange={handleSelectedGroup}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </p>

      <div>
        <button onClick={submit}>Opslaan</button>
      </div>
    </form>
  );
};

export default ScheduleView;
