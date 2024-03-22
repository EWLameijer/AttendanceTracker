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
  const [teacherId, setTeacherId] = useState<string>();
  const [groupId, setGroupId] = useState<string>();
  const [dateAsString, setDateAsString] = useState<string>(
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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDateAsString(event.target.value);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setTeacherId(event.target.value);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setGroupId(event.target.value);

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
      <h3>Voeg een nieuwe les toe:</h3>

      <p>
        Datum:
        <input
          id="inputDate"
          name="date"
          type="date"
          value={dateAsString.toString()}
          onChange={handleDateChange}
        ></input>
      </p>

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

      <p>
        Groep:
        <select id="group" name="group" onChange={handleGroupChange}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </p>

      <div>
        <button id="submitBtn" onClick={submit}>
          Opslaan
        </button>
      </div>

      <div>
        <p>Kies een groep:</p>
        <select>
          <option>51 C#</option>
          <option>52 Java</option>
          <option>53 CyberSecurity</option>
        </select>
      </div>

      <div>
        <p>Kies een begin- en einddatum:</p>
        <table>
          <tr>
            <td>Begindatum</td>
            <td>
              <input type="date" />
            </td>
            <td>Einddatum</td>
            <td>
              <input type="date" />
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
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
          <tr>
            <td>Maandag</td>
            <td>Dinsdag</td>
            <td>Woensdag</td>
            <td>Donderdag</td>
            <td>Vrijdag</td>
          </tr>
          <tr>
            <td>
              <select>
                <option></option>
                <option>Wubbo</option>
                <option>Kenji</option>
                <option>Mathijs</option>
              </select>
            </td>
            <td>
              <select>
                <option></option>
                <option>Wubbo</option>
                <option>Kenji</option>
                <option>Mathijs</option>
              </select>
            </td>
            <td>
              <select>
                <option></option>
                <option>Wubbo</option>
                <option>Kenji</option>
                <option>Mathijs</option>
              </select>
            </td>
            <td>
              <select>
                <option></option>
                <option>Wubbo</option>
                <option>Kenji</option>
                <option>Mathijs</option>
              </select>
            </td>
            <td>
              <select>
                <option></option>
                <option>Wubbo</option>
                <option>Kenji</option>
                <option>Mathijs</option>
              </select>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <p>
          Eventueel kunnen we nog een aparte invoerpagina maken om vakantiedagen
          in AT te kunnen opslaan. Want die zijn waarschijnlijk hetzelfde voor
          heel ITvitae. Vervolgens kun je met deze knop de hele fase en/of de
          gehele opleiding opslaan per groep. Het valt vast te regelen dat op
          basis hiervan roosters, lokaaloverzichten en dergelijke automatisch
          gegenereerd kunnen worden door Attendance Tracker. Op deze manier hoef
          je dan niet meer al die Excelbestanden te maken, plus al die variaties
          per groep.
        </p>
        <button>Sla periode op.</button>
      </div>
    </form>
  );
};

export default ScheduleView;
