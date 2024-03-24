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
  const [groupId, setGroupId] = useState<string>();
  const [startDateAsString, setStartDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [endDateAsString, setEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [teacherIdMonday, setTeacherIdMonday] = useState<string>();
  const [teacherIdTuesday, setTeacherIdTuesday] = useState<string>();
  const [teacherIdWednesday, setTeacherIdWednesday] = useState<string>();
  const [teacherIdThursday, setTeacherIdThursday] = useState<string>();
  const [teacherIdFriday, setTeacherIdFriday] = useState<string>();
  const [ExcludeStartDateAsString, setExcludeStartDateAsString] =
    useState<string>(toYYYYMMDD(new Date()));
  const [ExcludeEndDateAsString, setExcludeEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [classes, setClasses] = useState<string[]>();

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
        setTeacherIdMonday(response.data[0].id);
        setTeacherIdTuesday(response.data[0].id);
        setTeacherIdWednesday(response.data[0].id);
        setTeacherIdThursday(response.data[0].id);
        setTeacherIdFriday(response.data[0].id);
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

  const handleTeacherChangeMonday = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setTeacherIdMonday(event.target.value);

  const handleTeacherChangeTuesday = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setTeacherIdTuesday(event.target.value);

  const handleTeacherChangeWednesday = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setTeacherIdWednesday(event.target.value);

  const handleTeacherChangeThursday = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setTeacherIdThursday(event.target.value);

  const handleTeacherChangeFriday = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setTeacherIdFriday(event.target.value);

  const handleExcludeStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeStartDateAsString(event.target.value);

  const handleExcludeEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeEndDateAsString(event.target.value);

  const submitButton = document.getElementById("submitBtn");
  submitButton?.addEventListener("click", (event) => event.preventDefault());

  const generateClasses = () => {
    setClasses(["a", "b", "c"]);

    // generate classes based on radio buttons set to true
    //
  };

  const submitClasses = () => {
    // axios
    //   .post<ScheduledClass>(
    //     `${BASE_URL}/scheduled-classes`,
    //     {
    //       groupId,
    //       teacherId,
    //       dateAsString,
    //     },
    //     {
    //       auth: {
    //         username: user.username,
    //         password: user.password,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     if (response.status == HttpStatusCode.Created)
    //       alert("1 nieuwe les toegevoegd");
    //   })
    //   .catch((error) => {
    //     if (error.response.status == HttpStatusCode.BadRequest)
    //       alert("FOUT: Deze leraar heeft al een groep op deze dag");
    //     else alert(error.response.status + " " + error.response.data);
    //   });
  };

  return (
    <form>
      <h3>Voeg een nieuwe les toe:</h3>

      {startDateAsString}
      <br></br>
      {endDateAsString}
      <br></br>
      {teacherIdMonday}
      <br></br>
      {teacherIdTuesday}
      <br></br>
      {teacherIdWednesday}
      <br></br>
      {teacherIdThursday}
      <br></br>
      {teacherIdFriday}
      <br></br>
      <br></br>
      {ExcludeStartDateAsString}
      <br></br>
      {ExcludeEndDateAsString}
      <br></br>
      {classes}
      <br></br>

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
        <p>Kies een begin- en einddatum van de in te voeren periode:</p>
        Begindatum:
        <input
          id="inputStartDate"
          name="date"
          type="date"
          value={startDateAsString.toString()}
          onChange={handleStartDateChange}
        ></input>
        Einddatum:
        <input
          id="inputEndDate"
          name="date"
          type="date"
          value={endDateAsString.toString()}
          onChange={handleEndDateChange}
        ></input>
      </div>
      <div>
        <p>Selecteer lesdagen en wie die dag hun leraar is:</p>
        <input type="checkbox" />
        Maandag
        <select
          id="teacher"
          name="teacher"
          onChange={handleTeacherChangeMonday}
        >
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <br />
        <input type="checkbox" />
        Dinsdag
        <select
          id="teacher"
          name="teacher"
          onChange={handleTeacherChangeTuesday}
        >
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <br />
        <input type="checkbox" />
        Woensdag
        <select
          id="teacher"
          name="teacher"
          onChange={handleTeacherChangeWednesday}
        >
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <br />
        <input type="checkbox" />
        Donderdag
        <select
          id="teacher"
          name="teacher"
          onChange={handleTeacherChangeThursday}
        >
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <br />
        <input type="checkbox" />
        Vrijdag
        <select
          id="teacher"
          name="teacher"
          onChange={handleTeacherChangeFriday}
        >
          {teachers.map((teacher: Teacher, index: number) => (
            <option key={index} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button id="submitBtn" onClick={generateClasses}>
          Genereer periode
        </button>
      </div>
      <div>
        <p>{classes}</p>
      </div>
      <div>
        <p>Kies een begin- en einddatum van de uit te sluiten periode:</p>
        Begindatum:
        <input
          id="inputExcludeStartDate"
          name="date"
          type="date"
          value={ExcludeStartDateAsString.toString()}
          onChange={handleExcludeStartDateChange}
        ></input>
        Einddatum:
        <input
          id="inputExcludeEndDate"
          name="date"
          type="date"
          value={ExcludeEndDateAsString.toString()}
          onChange={handleExcludeEndDateChange}
        ></input>
      </div>
    </form>
  );
};

export default ScheduleView;
