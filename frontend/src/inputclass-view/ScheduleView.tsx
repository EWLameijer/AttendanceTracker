import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, addExtraData } from '../Class';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from '../utils';

const ScheduleView = () => {
    function saveClass(){
        // let date = document.getElementById("selectedDate");
        // let teacher = document.getElementById("selectedTeacher");
        // let group = document.getElementById("selectedGroup");

        let ptext = document.getElementById("pOutput");

        ptext.textContent = document.getElementById('selectedGroup')?.innerText;
    }
        
    let date, teacher, group;

    state = {
        teachers = axios.get(),
        groups = axios.get()
    };

    function setGroup(text: string){
        group = document.getElementById("selectedGroup");
    }

    return  <>
        <h2>Hallo!</h2>
        <h3>Voer nieuwe les in:</h3 >

        <p>Kies een datum:</p>
        <input id="inputDate" type="date" ></input><br />
        <p>Kies een leraar:</p>
        <select id="selectedTeacher">
            {/* get all teachers */}
            {this.state.teachers.map(teacher => <option key={teacher}></select>{teacher}</option>)}
            <option value="Wubbo">Wubbo</option>
            <option value="Kenji">Kenji</option>
        </select>
        <p>Kies een groep:</p>
        <select id="selectedGroup" onSelect="setGroup()">
            {/* get all groups */}
            <option value="51 Java">Java</option>
            <option value="52 Cyber">Cyber</option>
        </select>

        {/* <button onClick={saveClass}>Opslaan</button> */}

        <p id="pOutput">a</p>
    </>
}


export default ScheduleView;