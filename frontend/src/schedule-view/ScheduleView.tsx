import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClassInputDto } from "./ScheduledClassInputDto";
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
  const [classes, setClasses] = useState<ScheduledClassInputDto[]>(
    new Array<ScheduledClassInputDto>()
  );
  const [dayTeacher, setDayTeacher] = useState(["", "", "", "", ""]);

  const weekdays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
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
    const tempArray = [...dayTeacher];
    tempArray[day] = isActive ? teacherId : "";
    setDayTeacher(tempArray);
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

  document
    .getElementById("genClasses")
    ?.addEventListener("click", (event) => event.preventDefault());
  document
    .getElementById("excludeClasses")
    ?.addEventListener("click", (event) => event.preventDefault());
  document
    .getElementById("submitClasses")
    ?.addEventListener("click", (event) => event.preventDefault());

  const generateClasses = () => {
    const dateToCheck = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    const classesInSelectedPeriod: ScheduledClassInputDto[] = [];

    while (dateToCheck <= endDate) {
      if (dayTeacher[dateToCheck.getDay() - 1]) {
        const classToSchedule: ScheduledClassInputDto = {
          groupId: groupId,
          teacherId: dayTeacher[dateToCheck.getDay() - 1],
          dateAsString: toYYYYMMDD(dateToCheck),
        };
        classesInSelectedPeriod.push(classToSchedule);
      }
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }
    setClasses(classesInSelectedPeriod);
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
      const listOfClasses = [...classes];

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
    }
  };

  const showClasses = classes?.map((value) => (
    <p key={value.dateAsString}>{value.dateAsString}</p>
  ));

  const submitClasses = () => {
    axios
      .post<ScheduledClassInputDto[]>(
        `${BASE_URL}/scheduled-classes`,
        classes,
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        if (response.status == HttpStatusCode.Created) alert(response.data);
      })
      .catch((error) => {
        if (error.response.status == HttpStatusCode.BadRequest) {
          alert(error.response.data);
        } else alert(error.response.status + " " + error.response.data);
      });
  };

  return (
    teachers.length > 0 && (
      <form>
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
          <button id="submitClasses" onClick={submitClasses}>
            Sla alle lessen op.
          </button>
        </div>
      </form>
    )
  );
};

export default ScheduleView;
