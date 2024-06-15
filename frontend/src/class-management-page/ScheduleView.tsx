import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../shared/utils";
import { Group } from "../shared/Group";
import { Teacher } from "./Teacher";
import { ScheduledClassDtoWithoutAttendance } from "./ScheduledClassDtoWithoutAttendance";
import UserContext from "../login-page/UserContext";
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
  const [proposedClasses, setProposedClasses] = useState<
    ScheduledClassDtoWithoutAttendance[]
  >([]);
  const [teacherIdsWeek, setTeacherIdsWeek] = useState(Array(5).fill(""));
  const [scheduledClasses, setScheduledClasses] = useState<
    ScheduledClassDtoWithoutAttendance[]
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
      });
  }, []);

  useEffect(() => {
    if (!groupId) return;
    axios
      .get(`${BASE_URL}/scheduled-classes/${groupId}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setScheduledClasses(sortDescending(response.data));
      });
  }, [groupId]);

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

    const dayIndex = (date: Date) => date.getDay() - 1;

    const newClasses = [
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
    setProposedClasses(newClasses);
  };

  const handleExcludeStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeStartDateAsString(event.target.value);

  const handleExcludeEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeEndDateAsString(event.target.value);

  const excludeClasses = (event: React.FormEvent) => {
    event.preventDefault();
    if (proposedClasses.length == 0) {
      alert("Genereer eerst een periode");
    } else {
      const startOfExcludedPeriod = new Date(excludeStartDateAsString);
      const endOfExcludedPeriod = new Date(excludeEndDateAsString);

      const excludedClassesAsStrings = [
        ...dateRangeGenerator(startOfExcludedPeriod, endOfExcludedPeriod),
      ].map(toYYYYMMDD);

      const remainingClasses = [...proposedClasses].filter(
        (classDto) => !excludedClassesAsStrings.includes(classDto.dateAsString)
      );

      setProposedClasses(remainingClasses);
    }
  };

  const showClassesToAdd = proposedClasses.map((value) => (
    <p key={value.dateAsString}>{value.dateAsString}</p>
  ));

  const submitClasses = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post<ScheduledClassDtoWithoutAttendance[]>(
        `${BASE_URL}/scheduled-classes`,
        proposedClasses,
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
        setScheduledClasses(
          sortDescending([...response.data, ...scheduledClasses])
        );
      })
      .catch((error) => {
        if (error.response.status == HttpStatusCode.BadRequest) {
          console.log(error);
          alert(error.response.data.detail);
        } else alert(error.response.status + " " + error.response.data);
      });
  };

  const dayAbbreviation = (d: string) =>
    new Date(d).toLocaleString("nl-NL", { weekday: "long" }).substring(0, 2);

  const handleDeleteClass = (
    scheduledClass: ScheduledClassDtoWithoutAttendance
  ) => {
    if (confirm(scheduledClass.dateAsString + " verwijderen?")) {
      axios
        .delete(
          `${BASE_URL}/scheduled-classes/${scheduledClass.groupId}/${scheduledClass.dateAsString}`,
          {
            auth: {
              username: user.username,
              password: user.password,
            },
          }
        )
        .then(() => {
          alert(`${scheduledClass.dateAsString} is verwijderd.`);

          const filteredClasses = scheduledClasses.filter(
            (sc) => sc.dateAsString !== scheduledClass.dateAsString
          );

          setScheduledClasses(filteredClasses);
        })
        .catch(() =>
          alert(`Kan les van ${scheduledClass.dateAsString} niet verwijderen.`)
        );
    }
  };

  const showScheduledClasses = scheduledClasses.map((value) => (
    <p key={value.dateAsString}>
      {dayAbbreviation(value.dateAsString)} {value.dateAsString}
      <button
        value={value.dateAsString}
        onClick={() => handleDeleteClass(value)}
        hidden={new Date(value.dateAsString) <= new Date()}
      >
        X
      </button>
    </p>
  ));

  const sortDescending = (
    scheduledClassesArray: ScheduledClassDtoWithoutAttendance[]
  ) =>
    scheduledClassesArray.sort((a, b) =>
      b.dateAsString.localeCompare(a.dateAsString)
    );
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
              <td>{showScheduledClasses}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  );
};

export default ScheduleView;
