import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClass } from "./ScheduledClass";
import UserContext from "../context/UserContext";

const ScheduleView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherIdMonday, setTeacherIdMonday] = useState<string>();
  const [teacherIdTuesday, setTeacherIdTuesday] = useState<string>();
  const [teacherIdWednesday, setTeacherIdWednesday] = useState<string>();
  const [teacherIdThursday, setTeacherIdThursday] = useState<string>();
  const [teacherIdFriday, setTeacherIdFriday] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [startDateAsString, setStartDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [endDateAsString, setEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const user = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/personnel/teachers`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setTeachers(response.data);
        setTeacherId(response.data[0].id);
      });

    axios
      .get(`${BASE_URL}/groups`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setGroups(response.data);
        setGroupId(response.data[0].id);
      });
  }, []);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setGroupId(event.target.value);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setStartDateAsString(event.target.value);

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEndDateAsString(event.target.value);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTeacherId(event.target.value);

  const submitButton = document.getElementById("submitBtn");
  submitButton?.addEventListener("click", (event) => event.preventDefault());

  const submit = () => {
    axios
      .post<ScheduledClass>(
        `${BASE_URL}/scheduled-classes`,
        {
          groupId,
          teacherId,
          dateAsString,
        },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        if (response.status == HttpStatusCode.Created)
          alert("1 nieuwe les toegevoegd");
      })
      .catch((error) => {
        if (error.response.status == HttpStatusCode.BadRequest)
          alert("FOUT: Deze leraar heeft al een groep op deze dag");
        else alert(error.response.status + " " + error.response.data);
      });
  };

  return (
    <form>
      {/* Old ScheduleView below this */}

      <h3>Voeg een nieuwe les toe:</h3>

      {/* <p>
        Datum:
        <input
          id="inputDate"
          name="date"
          type="date"
          value={dateAsString.toString()}
          onChange={handleDateChange}
        ></input>
      </p> */}

      <p>
        Leraar:
        <select id="teacher" name="teacher" onChange={handleTeacherChange}>
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </p>

      {/* <p>
        Groep:
        <select id="group" name="group" onChange={handleGroupChange}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </p> */}

      {/* <div>
        <button id="submitBtn" onClick={submit}>
          Opslaan
        </button>
      </div> */}

      {/* Upgraded ScheduleView below this */}

      <div>
        <p>Kies een groep:</p>
        <select id="group" name="group" onChange={handleGroupChange}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p>Kies een begin- en einddatum:</p>
        <table>
          <tr>
            <td>Begindatum:</td>
            <td>
              <input
                id="inputStartDate"
                name="date"
                type="date"
                value={startDateAsString.toString()}
                onChange={handleStartDateChange}
              ></input>
            </td>
            <td>Einddatum:</td>
            <td>
              <input
                id="inputEndDate"
                name="date"
                type="date"
                value={endDateAsString.toString()}
                onChange={handleEndDateChange}
              ></input>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <p>Selecteer lesdagen en wie die dag hun leraar is:</p>
        <table>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Maandag</td>
            <td>
              <select></select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Dinsdag</td>
            <td>
              <select></select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Woensdag</td>
            <td>
              <select></select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Donderdag</td>
            <td>
              <select></select>
            </td>
          </tr>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>Vrijdag</td>
            <td>
              <select></select>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <button id="submitBtn" onClick={submit}>
          Opslaan
        </button>
      </div>
    </form>
  );
};

export default ScheduleView;
