import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../utils";
import { Group } from "../admin-view/Group";
import { Teacher } from "./Teacher";
import { ScheduledClassInputDto } from "./ScheduledClassInputDto";
import UserContext from "../context/UserContext";
import TeacherIdsWeek from "./TeacherIdsWeek";

const ScheduleView = () => {
  const today = toYYYYMMDD(new Date());
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groupId, setGroupId] = useState<string>("");
  const [startDateAsString, setStartDateAsString] = useState<string>(today);
  const [endDateAsString, setEndDateAsString] = useState<string>(today);
  const [excludeStartDateAsString, setExcludeStartDateAsString] =
    useState<string>(today);
  const [excludeEndDateAsString, setExcludeEndDateAsString] =
    useState<string>(today);
  const [classes, setClasses] = useState<ScheduledClassInputDto[]>(
    new Array<ScheduledClassInputDto>()
  );
  const [teacherIdsWeek, setTeacherIdsWeek] = useState(["", "", "", "", ""]);

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

  const updateTeacherIdForADay = (
    day: number,
    teacherId: string,
    isActive: boolean
  ) => {
    const localCopyOfTeacherIdsWeek = [...teacherIdsWeek];
    localCopyOfTeacherIdsWeek[day] = isActive ? teacherId : "";
    setTeacherIdsWeek(localCopyOfTeacherIdsWeek);
  };

  const createTeacherIdsWeek = weekdays.map((day, index) => (
    <TeacherIdsWeek
      updateTeacherIdForADay={updateTeacherIdForADay}
      dayIndex={index}
      key={day}
      day={day}
      teachers={teachers}
    />
  ));

  const generateClasses = (event: React.FormEvent) => {
    event.preventDefault();
    const dateToCheck = new Date(startDateAsString);
    const endDate = new Date(endDateAsString);
    const classesInSelectedPeriod: ScheduledClassInputDto[] = [];

    while (dateToCheck <= endDate) {
      if (teacherIdsWeek[dateToCheck.getDay() - 1]) {
        const classToSchedule: ScheduledClassInputDto = {
          groupId: groupId,
          teacherId: teacherIdsWeek[dateToCheck.getDay() - 1],
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

  const excludeClasses = (event: React.FormEvent) => {
    event.preventDefault();
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

  const submitClasses = (event: React.FormEvent) => {
    event.preventDefault();

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
          <select onChange={handleGroupChange}>
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
          {createTeacherIdsWeek}
        </div>

        <div>
          <button onClick={generateClasses}>Genereer periode</button>
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
          <button onClick={excludeClasses}>Verwijder selectie</button>
        </div>

        <div>
          <button onClick={submitClasses}>Sla alle lessen op.</button>
        </div>
      </form>
    )
  );
};

export default ScheduleView;
