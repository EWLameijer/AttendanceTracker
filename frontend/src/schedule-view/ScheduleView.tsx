import axios from "axios";
import { useState, useEffect } from "react";
import { Attendance, Class, addExtraData } from "../Class";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import { ScheduledClass } from "./ScheduledClass";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";

const ScheduleView = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedOption, setSelectedOption] = useState<String>();

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

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  return (
    <form>
      <h2>Hallo!</h2>
      <h3>Voer nieuwe les in:</h3>

      <p>Kies een datum:</p>
      <input id="inputDate" type="date"></input>
      <br />

      <p>Kies een leraar:</p>
      <select id="teacher" onChange={selectChange}>
        {teachers.map((value: Teacher, index: number) => (
          <option value={index}>{value.name}</option>
        ))}
      </select>
      <p>Kies een groep:</p>

      <select id="group">
        {groups.map((value: Group, index: number) => (
          <option value={index}>{value.name}</option>
        ))}
      </select>

      <div>
        <br></br>
        <button>Opslaan</button>
      </div>

      <p>{selectedOption}</p>
    </form>
  );
};

export default ScheduleView;
