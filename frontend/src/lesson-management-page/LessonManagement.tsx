import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useContext } from "react";
import { BASE_URL, toYYYYMMDD } from "../-shared/utils";
import { Group } from "../-shared/Group";
import { Teacher } from "../-shared/Teacher";
import { LessonDtoWithoutAttendance } from "./LessonDtoWithoutAttendance";
import UserContext from "../-shared/UserContext";
import TeacherIdsWeek from "./TeacherIdsWeek";
import HomeButton from "../-shared/HomeButton";

const LessonManagement = () => {
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
  const [proposedLessons, setProposedLessons] = useState<
    LessonDtoWithoutAttendance[]
  >([]);
  const [teacherIdsWeek, setTeacherIdsWeek] = useState(Array(5).fill(""));
  const [scheduledLessons, setScheduledLessons] = useState<
    LessonDtoWithoutAttendance[]
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
      .get(`${BASE_URL}/lessons/${groupId}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setScheduledLessons(sortDescending(response.data));
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

  const generateLessons = (event: React.FormEvent) => {
    event.preventDefault();

    const dayIndex = (date: Date) => date.getDay() - 1;

    const newLessons = [
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
    setProposedLessons(newLessons);
  };

  const handleExcludeStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeStartDateAsString(event.target.value);

  const handleExcludeEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExcludeEndDateAsString(event.target.value);

  const excludeLessons = (event: React.FormEvent) => {
    event.preventDefault();
    if (!proposedLessons.length) {
      alert("Genereer eerst een periode");
    } else {
      const startOfExcludedPeriod = new Date(excludeStartDateAsString);
      const endOfExcludedPeriod = new Date(excludeEndDateAsString);

      const excludedLessonsAsStrings = [
        ...dateRangeGenerator(startOfExcludedPeriod, endOfExcludedPeriod),
      ].map(toYYYYMMDD);

      const remainingLessons = [...proposedLessons].filter(
        (lessonDto) =>
          !excludedLessonsAsStrings.includes(lessonDto.dateAsString)
      );

      setProposedLessons(remainingLessons);
    }
  };

  const deleteMessage = (lessonDto: LessonDtoWithoutAttendance) =>
    getFormattedLesson(lessonDto) + " verwijderen?";

  const handleDeleteProposedLesson = (
    proposedLesson: LessonDtoWithoutAttendance
  ) => {
    if (confirm(deleteMessage(proposedLesson))) {
      const filteredLessons = proposedLessons.filter(
        (sc) => sc.dateAsString !== proposedLesson.dateAsString
      );

      setProposedLessons(filteredLessons);
    }
  };

  const getFormattedLesson = (lessonDto: LessonDtoWithoutAttendance) => {
    const dayAbbreviation = new Date(lessonDto.dateAsString)
      .toLocaleString("nl-NL", { weekday: "long" })
      .substring(0, 2);
    const teacherName = teachers.find(
      (x) => x.id === lessonDto.teacherId
    )?.name;

    return dayAbbreviation + " " + lessonDto.dateAsString + " " + teacherName;
  };

  const showProposedLessons = proposedLessons.map((value) => (
    <li key={value.dateAsString}>
      {getFormattedLesson(value)};
      <button
        value={value.dateAsString}
        onClick={() => handleDeleteProposedLesson(value)}
      >
        X
      </button>
    </li>
  ));

  const submitLessons = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post<LessonDtoWithoutAttendance[]>(
        `${BASE_URL}/lessons`,
        proposedLessons,
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        if (response.status === HttpStatusCode.Created) {
          const numberOfLessons = response.data.length;
          const lessonTerm = "les" + (numberOfLessons !== 1 ? "sen" : "");
          alert(`${numberOfLessons} ${lessonTerm} toegevoegd.`);
        }
        setScheduledLessons(
          sortDescending([...response.data, ...scheduledLessons])
        );

        setProposedLessons(new Array<LessonDtoWithoutAttendance>());
      })
      .catch((error) => {
        if (error.response.status === HttpStatusCode.BadRequest) {
          console.log(error);
          alert(error.response.data.detail);
        } else alert(error.response.status + " " + error.response.data);
      });
  };

  const handleDeleteScheduledLesson = (
    scheduledLesson: LessonDtoWithoutAttendance
  ) => {
    if (confirm(deleteMessage(scheduledLesson))) {
      axios
        .delete(
          `${BASE_URL}/lessons/${scheduledLesson.groupId}/${scheduledLesson.dateAsString}`,
          {
            auth: {
              username: user.username,
              password: user.password,
            },
          }
        )
        .then(() => {
          alert(`${scheduledLesson.dateAsString} is verwijderd.`);

          const filteredLessons = scheduledLessons.filter(
            (sc) => sc.dateAsString !== scheduledLesson.dateAsString
          );

          setScheduledLessons(filteredLessons);
        })
        .catch(() =>
          alert(`Kan les van ${scheduledLesson.dateAsString} niet verwijderen.`)
        );
    }
  };

  const showScheduledLessons = scheduledLessons.map((lessonDto) => (
    <li key={lessonDto.dateAsString}>
      {getFormattedLesson(lessonDto)}
      <button
        value={lessonDto.dateAsString}
        onClick={() => handleDeleteScheduledLesson(lessonDto)}
        hidden={new Date(lessonDto.dateAsString) <= new Date()}
      >
        X
      </button>
    </li>
  ));

  const sortDescending = (
    scheduledLessonsArray: LessonDtoWithoutAttendance[]
  ) =>
    scheduledLessonsArray.sort((a, b) =>
      b.dateAsString.localeCompare(a.dateAsString)
    );

  return (
    //The purpose of "teachers.length > 0" is to ensure axios has processed the data before it loads the page

    <>
      <HomeButton />
      {!teachers.length && (
        <h2>Er kunnen geen lessen worden gepland als er geen docenten zijn!</h2>
      )}
      {!groups.length && (
        <h2>Er kunnen geen lessen worden gepland als er geen groepen zijn!</h2>
      )}
      {teachers.length > 0 && groups.length > 0 && (
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
                        Kies een begin- en einddatum van de in te voeren
                        periode:
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
                      <button onClick={generateLessons}>
                        Genereer periode
                      </button>
                    </div>

                    <hr />

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

                    <div>
                      <button onClick={excludeLessons}>
                        Verwijder selectie
                      </button>
                    </div>

                    <div>
                      <ul className="striping no-bullets">
                        {showProposedLessons}
                      </ul>
                    </div>

                    <hr />

                    <div>
                      <button onClick={submitLessons}>
                        Sla alle lessen op.
                      </button>
                    </div>
                  </form>
                </td>
                <td>
                  <ul className="striping no-bullets">
                    {showScheduledLessons}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};
export default LessonManagement;
