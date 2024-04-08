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
  const [groupId, setGroupId] = useState<string>("");
  const [startDateAsString, setStartDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [endDateAsString, setEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [excludeStartDateAsString, setExcludeStartDateAsString] =
    useState<string>(toYYYYMMDD(new Date()));
  const [excludeEndDateAsString, setExcludeEndDateAsString] = useState<string>(
    toYYYYMMDD(new Date())
  );
  const [classes, setClasses] = useState<ScheduledClass[]>(
    new Array<ScheduledClass>()
  );

  const weekdays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
  const dayTeacher = ["", "", "", "", ""];
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

  const updateDayTeacher = (
    day: number,
    teacherId: string,
    isActive: boolean
  ) => {
    if (isActive) dayTeacher[day] = teacherId;
    else dayTeacher[day] = "";
  };

  const createDayTeachers = weekdays.map((value, index) => (
    <DayTeacher
      updateDayTeacher={updateDayTeacher}
      dayIndex={index}
      key={value}
      day={value}
      teachers={teachers}
    />
  ));

  const generate = document.getElementById("genClasses");
  generate?.addEventListener("click", (event) => event.preventDefault());
  const exclude = document.getElementById("excludeClasses");
  exclude?.addEventListener("click", (event) => event.preventDefault());

  const generateClasses = () => {
    const dateToCheck = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    const classesInSelectedPeriod: ScheduledClass[] = [];

    while (dateToCheck <= endDate) {
      // dayTeacher[0..4] = monday..friday = getDay 1..5
      // This is why the -1 is here.
      if (dayTeacher[dateToCheck.getDay() - 1]) {
        const classToSchedule: ScheduledClass = {
          groupId: groupId,
          teacherId: dayTeacher[dateToCheck.getDay() - 1],
          dateAsString: toYYYYMMDD(dateToCheck),
        };
        classesInSelectedPeriod.push(classToSchedule);
      }
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }
    setClasses(classesInSelectedPeriod);
    console.log("Initial period:");
    console.table(classesInSelectedPeriod);
    // Bug: The button resets dayTeacher[] if clicked twice
  };

  const handleExcludeStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeStartDateAsString(event.target.value);

  const handleExcludeEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeEndDateAsString(event.target.value);

  const excludeClasses = () => {
    if (classes.length == 0) {
      alert("Genereer eerst een periode");
    } else {
      const dateToCheck = new Date(excludeStartDateAsString);
      const endDate = new Date(excludeEndDateAsString);
      const listOfClasses = classes;

      while (dateToCheck <= endDate) {
        const index = listOfClasses
          .map(function (e) {
            return e.dateAsString;
          })
          .indexOf(toYYYYMMDD(dateToCheck));
        if (index > -1) {
          listOfClasses?.splice(index, 1);
        }
        dateToCheck.setDate(dateToCheck.getDate() + 1);
      }
      setClasses(listOfClasses);
      console.log("Result:");
      console.table(listOfClasses);
    }
  };

  const showClasses = classes?.map((value) => (
    <p key={value.dateAsString}>{value.dateAsString}</p>
  ));

  const submitClasses = () => {
    axios
      .post<ScheduledClass>(
        `${BASE_URL}/scheduled-classes`,
        {
          classes,
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
    teachers.length > 0 && (
      <form>
        <p>To do:</p>
        <ul>
          <li>Fix bug of generate list button</li>
          <li>Fix text area updating on pruned dates</li>
          <li>
            Refactor api to accept list of ScheduledClass or something. Ran into
            an issue. The foreach in java runs "until done or it hits an
            exception". Duplicate entry is exception. Keep API as single entry
            save?
          </li>
          <li>Clean up code</li>
          <li>Add tables?</li>
        </ul>

        <h3>Voeg een nieuwe les toe:</h3>

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
            type="date"
            value={startDateAsString}
            onChange={handleStartDateChange}
          ></input>
          Einddatum:
          <input
            type="date"
            value={endDateAsString}
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
          <p>Kies een begin- en einddatum van de uit te sluiten periode:</p>
          Begindatum:
          <input
            type="date"
            value={excludeStartDateAsString}
            onChange={handleExcludeStartDateChange}
          ></input>
          Einddatum:
          <input
            type="date"
            value={excludeEndDateAsString}
            onChange={handleExcludeEndDateChange}
          ></input>
        </div>

        <div>{showClasses}</div>

        <div>
          <button id="excludeClasses" onClick={excludeClasses}>
            Verwijder selectie
          </button>
        </div>

        <div>
          <button onClick={submitClasses}>Sla alle lessen op.</button>
        </div>
      </form>
    )
  );
};

export default ScheduleView;
