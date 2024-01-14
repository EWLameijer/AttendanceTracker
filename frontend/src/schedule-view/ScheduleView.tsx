import axios from "axios";
import { useState, useEffect } from "react";
import { Attendance, Class, addExtraData } from "../Class";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import { ScheduledClass } from "./ScheduledClass";

const ScheduleView = () => {
  const [scheduledClass, setScheduledClass] = useState({
    teacher: "Kenji",
    group: "52 Cyber",
  });

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
        <option>{scheduledClass.teacher}</option>
      </select>
      <p>Kies een groep:</p>
      <select id="group">
        <option>{scheduledClass.group}</option>
      </select>
      <div>
        <br></br>
        <button>Opslaan</button>
      </div>
    </form>
  );
};

export default ScheduleView;
