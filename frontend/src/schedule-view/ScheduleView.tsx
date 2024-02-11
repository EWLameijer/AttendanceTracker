import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClass } from "./ScheduledClass";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherName, setTeacherName] = useState<String>();
  const [groupName, setGroupName] = useState<String>();
  const [dateAsString, setDateAsString] = useState<String>(
    toYYYYMMDD(new Date())
  );

  var apiWerkt = "api werkt niet";

  // - Set up API path to save selected date
  // - Give feedback of what happened with the submitted date

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
      setTeacherName(response.data[0].name);
    });

    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
      setGroupName(response.data[0].name);
    });
  }, []);

  const handleDateChanged = (event: any) => {
    setDateAsString(event.target.value);
  };

  const handleSelectedTeacher = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setTeacherName(value);
  };

  const handleSelectedGroup = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setGroupName(value);
  };

  const submit = () => {
    axios
      .post<ScheduledClass>(`${BASE_URL}/scheduledclass`, {
        groupName,
        teacherName,
        dateAsString,
      })
      .then((response) => {
        apiWerkt = response.data.groupName;
      })
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

      <p>{teacherName}</p>
      <p>{groupName}</p>
      <p>{dateAsString}</p>
      <p>{apiWerkt}</p>
    </form>
  );
};

export default ScheduleView;
