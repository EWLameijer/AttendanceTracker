import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selection, setSelection] = useState({
    teacher: String,
    group: String,
    date: String,
  });
  const [selectedTeacher, setSelectedTeacher] = useState<String>();
  const [selectedGroup, setSelectedGroup] = useState<String>();
  const [selectedDate, setSelectedDate] = useState<String>(
    toYYYYMMDD(new Date())
  );

  // - Set up API path to save selected data

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

  const handleSelectionChanged = (event: any) => {
    setSelection({ ...selection, [event.target.name]: event.target.value });
  };

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
      .post(`${BASE_URL}/scheduled_class`, {
        selectedDate,
        selectedTeacher,
        selectedGroup,
      })
      .then(() => {})
      .catch(() => {});
  };

  return (
    <form>
      <h2>Hallo!</h2>
      <h3>Voer nieuwe les in:</h3>

      <p>Kies een datum:</p>
      <input
        id="inputDate"
        name="date"
        type="date"
        value={selectedDate.toString()}
        onChange={handleDateChanged}
      ></input>
      <br />

      <p>Kies een leraar:</p>
      <select id="teacher" name="teacher" onChange={handleSelectedTeacher}>
        {teachers.map((value: Teacher, index: number) => (
          <option key={index}>{value.name}</option>
        ))}
      </select>

      <p>Kies een groep:</p>
      <select id="group" name="group" onChange={handleSelectedGroup}>
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
      <p>{selectedDate}</p>
    </form>
  );
};

export default ScheduleView;
