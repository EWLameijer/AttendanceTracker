import axios from "axios";
import { useState, useEffect } from "react";
import { Attendance, Class, addExtraData } from "../Class";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import { ScheduledClass } from "./ScheduledClass";
import { Group } from "../admin-view/Group";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  // const [teachers, setTeachers] = useState<Teacher[]>({});

  useEffect(() => {
    axios.get(`${BASE_URL}/admin-view/chantal/groups`).then((response) => {
      setGroups(response.data);
    });
  }, []);

  function saveClass() {
    // let date = document.getElementById("selectedDate");
    // let teacher = document.getElementById("selectedTeacher");
    // let group = document.getElementById("selectedGroup");
  }

  return (
    <form>
      <h2>Hallo!</h2>
      <h3>Voer nieuwe les in:</h3>

      <p>Kies een datum:</p>
      <input id="inputDate" type="date"></input>
      <br />
      <p>Kies een leraar:</p>
      <select id="teacher">
        <option>Kenji</option>
        <option>Wubbo</option>
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
    </form>
  );
};

export default ScheduleView;
