import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<String>();
  const [selectedGroup, setSelectedGroup] = useState<String>();
  const [selectedDate, setSelectedDate] = useState<String>(
    toYYYYMMDD(new Date())
  );

  // - Set up API path to save selected date
  // - Give feedback of what happened with the submitted date

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
      setSelectedTeacher(response.data[0].name);
    });

    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
      setSelectedGroup(response.data[0].name);
    });
  }, []);

  const handleDateChanged = (event: any) => {
    setSelectedDate(event.target.value);
  };

  const handleSelectedTeacher = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTeacher(value);
  };

  const handleSelectedGroup = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedGroup(value);
  };

  const submit = () => {
    axios
      .post(`${BASE_URL}/scheduledclass`, {
        selectedDate,
        selectedTeacher,
        selectedGroup,
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
          value={selectedDate.toString()}
          onChange={handleDateChanged}
        ></input>
      </p>

      <p>
        Leraar:
        <select id="teacher" name="teacher" onChange={handleSelectedTeacher}>
          {teachers.map((value: Teacher, index: number) => (
            <option key={index}>{value.name}</option>
          ))}
        </select>
      </p>

      <p>
        Groep:
        <select id="group" name="group" onChange={handleSelectedGroup}>
          {groups.map((value: Group, index: number) => (
            <option key={index}>{value.name}</option>
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
