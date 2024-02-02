import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<String>();
  const [selectedGroup, setSelectedGroup] = useState<String>();
  // const [selectedDate, setSelectedDate] = useState<String>();

  // - Capture selected date in a variable
  // - Set up API path to save selected data

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
      setSelectedTeacher(response.data[0].name);
    });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
      setSelectedGroup(response.data[0].name);
    });
  }, []);

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
      .post(`${BASE_URL}/scheduled_class`, {
        a: String,
        b: String,
      })
      .then(() => {})
      .catch(() => {});
  };

  return (
    <form>
      <h2>Hallo!</h2>
      <h3>Voer nieuwe les in:</h3>

      <p>Kies een datum:</p>
      <input id="inputDate" type="date"></input>
      <br />

      <p>Kies een leraar:</p>
      <select id="teacher" onChange={handleSelectedTeacher}>
        {teachers.map((value: Teacher, index: number) => (
          <option key={index}>{value.name}</option>
        ))}
      </select>

      <p>Kies een groep:</p>
      <select id="group" onChange={handleSelectedGroup}>
        {groups.map((value: Group, index: number) => (
          <option key={index}>{value.name}</option>
        ))}
      </select>

      <div>
        <br></br>
        <button onClick={submit}>Opslaan</button>
      </div>

      <p>{selectedTeacher}</p>
      <p>{selectedGroup}</p>
    </form>
  );
};

export default ScheduleView;
