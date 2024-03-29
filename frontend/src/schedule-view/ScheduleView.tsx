import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClass } from "./ScheduledClass";
import UserContext from "../context/UserContext";
import DayTeacher from "./DayTeacher";

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
  //const [checkbox, setCheckbox] = useState<boolean>();

  const [ExcludeStartDateAsString, setExcludeStartDateAsString] =
    useState<string>(toYYYYMMDD(new Date()));
  const [ExcludeEndDateAsString, setExcludeEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [classes, setClasses] = useState<string[]>(new Array<string>());

  const weekdays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
  const dayTeacher = ["", "", "", "", ""];

  const user = useContext(UserContext);

  const updateDayTeacher = (
    day: number,
    teacherId: string,
    isActive: boolean
  ) => {
    if (isActive) dayTeacher[day] = teacherId;
    else dayTeacher[day] = "";

    console.log("update day teacher");
    console.table(dayTeacher);
  };

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

  // const handleCheckboxChange = () => {
  //   setCheckbox(!checkbox);
  // };

  const createDayTeachers = weekdays.map((value, index) => (
    <DayTeacher
      updateDayTeacher={updateDayTeacher}
      dayIndex={index}
      key={value}
      day={value}
      //onCheckboxChange={handleCheckboxChange}
      teachers={teachers}
    />
  ));

  const handleExcludeStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeStartDateAsString(event.target.value);

  const handleExcludeEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeEndDateAsString(event.target.value);

  const submitButton = document.getElementById("genClasses");
  submitButton?.addEventListener("click", (event) => event.preventDefault());

  const generateClasses = () => {
    const startDate = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    const datesOfClasses = new Array<string>();

    while (startDate < endDate) {
      startDate.setDate(startDate.getDate() + 1);
      if (
        (dayTeacher[0] != "" && startDate.getDay() == 1) || // dayTeacher[] is zero based, getDay has 0 for sunday.
        (dayTeacher[1] != "" && startDate.getDay() == 2) ||
        (dayTeacher[2] != "" && startDate.getDay() == 3) ||
        (dayTeacher[3] != "" && startDate.getDay() == 4) ||
        (dayTeacher[4] != "" && startDate.getDay() == 5)
      ) {
        datesOfClasses.push(toYYYYMMDD(startDate));
      }
    }
    setClasses(datesOfClasses);
    // This button resets dayTeacher[] if clicked twice
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
    teachers.length > 0 && (
      <form>
        <h3>Voeg een nieuwe les toe:</h3>

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
          {createDayTeachers}
        </div>

        <div>
          <button id="genClasses" onClick={generateClasses}>
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

        <div>
          <button onClick={submitClasses}>Sla alle lessen op.</button>
        </div>
      </form>
    )
  );
};

export default ScheduleView;
