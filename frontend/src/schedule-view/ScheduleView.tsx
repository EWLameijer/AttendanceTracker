import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";

const ScheduleView = () => {
  const [date, setDate] = useState<String>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<String>();

  useEffect(() => {
    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/teachers`).then((response) => {
      setTeachers(response.data);
    });
  }, []);

  // BUG: initial value not set to teachers[0]
  const handleSelectedTeacher = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTeacher(value);
  };

  const selectedDate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDate(event.target.value);
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

      <select id="group">
        {groups.map((value: Group, index: number) => (
          <option key={index}>{value.name}</option>
        ))}
      </select>

      <div>
        <br></br>
        <button>Opslaan</button>
      </div>

      <p>{selectedTeacher}</p>
    </form>
  );
};

export default ScheduleView;
