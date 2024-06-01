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
  const [classes, setClasses] = useState<ScheduledClassInputDto[]>([]);
  const [teacherIdsWeek, setTeacherIdsWeek] = useState(Array(5).fill(""));
  const [existingClasses, setExistingClasses] = useState<
    ScheduledClassInputDto[]
  >([]);

  const weekdays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
  const user = useContext(UserContext);

  const dateRangeGenerator = function* (start: Date, end: Date) {
    const d = new Date(start);
    while (d <= end) {
      yield new Date(d);
      d.setDate(d.getDate() + 1);
    }
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
        getExistingClassesForSelectedGroup(response.data[0].id);
      });
  }, []);

  const getExistingClassesForSelectedGroup = (id: string) => {
    axios
      .get(`${BASE_URL}/scheduled-classes/${id}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setExistingClasses(response.data);
      });
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: string = event.target.value;

    setGroupId(id);

    getExistingClassesForSelectedGroup(id);
  };

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

    const dayIndex = (date: Date) => date.getDay() - 1;

    const scheduledClasses = [
      ...dateRangeGenerator(
        new Date(startDateAsString),
        new Date(endDateAsString)
      ),
    ]
      .filter((date) => teacherIdsWeek[dayIndex(date)])
      .map((date) => ({
        groupId,
        teacherId: teacherIdsWeek[dayIndex(date)],
        dateAsString: toYYYYMMDD(date),
      }));
    setClasses(scheduledClasses);
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
      const startOfExcludedPeriod = new Date(excludeStartDateAsString);
      const endOfExcludedPeriod = new Date(excludeEndDateAsString);

      const excludedClassesAsStrings = [
        ...dateRangeGenerator(startOfExcludedPeriod, endOfExcludedPeriod),
      ].map(toYYYYMMDD);

      const remainingClasses = [...classes].filter(
        (classDto) => !excludedClassesAsStrings.includes(classDto.dateAsString)
      );

      setClasses(remainingClasses);
    }
  };

  const showClassesToAdd = classes.map((value) => (
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
        if (response.status == HttpStatusCode.Created)
          alert(response.data.length + " lessen toegevoegd.");
        setExistingClasses([...existingClasses, ...response.data]);
      })
      .catch((error) => {
        if (error.response.status == HttpStatusCode.BadRequest) {
          console.log(error);
          alert(error.response.data.detail);
        } else alert(error.response.status + " " + error.response.data);
      });
  };

  const handleDeleteClass = (sc: ScheduledClassInputDto) => {
    if (confirm(sc.dateAsString + " verwijderen?")) {
      alert(sc.dateAsString + " is verwijderd.");
    }
  };

  const showExistingClasses = existingClasses.map((value) => (
    <p key={value.dateAsString}>
      {value.dateAsString}
      <button
        value={value.dateAsString}
        onClick={() => handleDeleteClass(value)}
      >
        X
      </button>
    </p>
  ));

  return (
    //The purpose of "teachers.length > 0" is to ensure axios has processed the data before it loads the page
    teachers.length > 0 && (
      <>
        <p>Kies een groep:</p>
        <select onChange={handleGroupChange}>
          {groups.map((group: Group, index: number) => (
            <option key={index} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <table>
          <thead>
            <tr>
              <th>Voeg nieuwe lessen toe:</th>
              <th>Verwijder bestaande lessen:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form>
                  <div>
                    <p>
                      Kies een begin- en einddatum van de in te voeren periode:
                    </p>
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
                    <p>
                      Kies een begin- en einddatum van de uit te sluiten
                      periode:
                    </p>
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

                  <div>{showClassesToAdd}</div>

                  <div>
                    <button onClick={excludeClasses}>Verwijder selectie</button>
                  </div>

                  <div>
                    <button onClick={submitClasses}>Sla alle lessen op.</button>
                  </div>
                </form>
              </td>
              <td>{showExistingClasses}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  );
};

export default ScheduleView;
