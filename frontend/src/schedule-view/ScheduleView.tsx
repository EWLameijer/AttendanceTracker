import axios from "axios";
import { useState, useEffect } from "react";
import { Attendance, Class, addExtraData } from "../Class";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";

const ScheduleView = () => {
  function saveClass() {
    // let date = document.getElementById("selectedDate");
    // let teacher = document.getElementById("selectedTeacher");
    // let group = document.getElementById("selectedGroup");
  }

  return (
    <>
      <h2>Hallo!</h2>
      <h3>Voer nieuwe les in:</h3>

      <p>Kies een datum:</p>
      <input id="inputDate" type="date"></input>
      <br />
      <p>Kies een leraar:</p>
      <select id="selectedTeacher">
        <option value="Wubbo">Wubbo</option>
        <option value="Kenji">Kenji</option>
        <option value="52 Cyber">Cyber</option>
      </select>
      <p>Kies een groep:</p>
      <select id="selectedGroup">
        <option value="51">51</option>
        <option value="52">52</option>
        <option value="53">53</option>
      </select>
      <div>
        <br></br>
        <button>Opslaan</button>
      </div>
    </>
  );
};

export default ScheduleView;
