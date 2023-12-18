import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, addExtraData } from '../Class';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from '../utils';

const ScheduleView = () => {
    function saveClass(){
        let test = document.getElementById('ptest');
        test.textContent = document.getElementById('selectedGroup')?.innerText;
    }

    return  <>
        <h2>Hallo!</h2>
        <h3>Voer nieuwe les in:</h3 >

        <p>Kies een datum:</p>
        <input id="inputDate" type="date" ></input><br />
        <p>Kies een leraar:</p>
        <select id="selectedTeacher">
            {/* get all teachers */}
            <option value="Wubbo">Wubbo</option>
            <option value="Kenji">Kenji</option>
        </select>
        <p>Kies een groep:</p>
        <select id="selectedGroup">
            {/* get all groups */}
            <option value="51 Java">Java</option>
            <option value="52 Cyber">Cyber</option>
        </select>

        <button onClick={saveClass}>Opslaan</button>

        <p id="ptest">a</p>
    </>
}


export default ScheduleView;