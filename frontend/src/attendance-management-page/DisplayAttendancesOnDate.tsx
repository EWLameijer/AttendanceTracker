import { useContext, useEffect, useState } from "react";
import {
  BASE_URL,
  capitalize,
  dateOptions,
  toYYYYMMDD,
} from "../-shared/utils";
import axios from "axios";
import { Lesson, addExtraData } from "../-shared/Lesson";
import DisplayGroup from "./DisplayGroup";
import UserContext from "../-shared/UserContext";

// there may be a better way than this... But state is not sufficient, as useState resets the date to today whenever I return from another page, like history
let lastDate = new Date();

interface DateSchedule {
  timeOfLatestUpdate: string;
  previousDate?: string;
  currentDate: string;
  nextDate?: string;
  lessons: Lesson[];
}

let manuallyEditing = false;

const DisplayAttendancesOnDate = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [previousDate, setPreviousDate] = useState<string | undefined>();
  const [nextDate, setNextDate] = useState<string | undefined>();

  const [dateInPicker, setDateInPicker] = useState(toYYYYMMDD(lastDate));

  const user = useContext(UserContext);

  let latestUpdateProcessed = "";

  const latestUpdateChecker = () =>
    axios
      .get<string>(`${BASE_URL}/attendances/latest-update`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        if (latestUpdateProcessed !== response.data)
          loadDate(toYYYYMMDD(lastDate));
      });

  useEffect(() => {
    const dateAsString = toYYYYMMDD(lastDate);
    loadDate(dateAsString);

    // websockets would be nicer, but I could not get those working within reasonable time. This could be a future feature, though
    // with a maximum of about 9 users I don't expect that the server will need unreasonable amounts of resources, security or features
    // may be a more valuable issue.
    const heartbeat = setInterval(latestUpdateChecker, 1000);
    return () => clearInterval(heartbeat);
  }, []);

  function loadDate(dateAsString: string, exactDateRequired: boolean = false) {
    const datePath = exactDateRequired ? "by-exact-date" : "by-date";
    axios
      .get<DateSchedule>(
        `${BASE_URL}/attendances/${datePath}/${dateAsString}`,
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        const schedule = response.data;
        latestUpdateProcessed = schedule.timeOfLatestUpdate;
        setPreviousDate(schedule.previousDate);
        setNextDate(schedule.nextDate);
        lastDate = new Date(Date.parse(schedule.currentDate));
        setDateInPicker(toYYYYMMDD(lastDate));
        const rawLessons = schedule.lessons;
        for (const rawLesson of rawLessons) {
          const fullFormatAttendances = rawLesson.attendances.map(
            (attendance) => addExtraData(attendance)
          );
          rawLesson.attendances = fullFormatAttendances;
        }
        setLessons(rawLessons);
      });
  }

  const getDisplayedDay = () => lastDate;

  const previousLessonDay = () => loadDate(previousDate!);

  const nextLessonDay = () => loadDate(nextDate!);

  const updateDateAndRerenderUnlessStillTyping = (newDateAsString: string) => {
    if (manuallyEditing) setDateInPicker(newDateAsString);
    else loadDate(newDateAsString, true);
  };

  return !lessons.length && !previousDate && !nextDate ? (
    <h3>Geen lessen ingepland in nabij verleden of toekomst!</h3>
  ) : (
    <>
      <h3>
        <button onClick={previousLessonDay} disabled={!previousDate}>
          Vorige lesdag
        </button>
        {capitalize(getDisplayedDay().toLocaleDateString("nl-NL", dateOptions))}
        <button onClick={nextLessonDay} disabled={!nextDate}>
          Volgende lesdag
        </button>
        <input
          type="date"
          value={dateInPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter")
              updateDateAndRerenderUnlessStillTyping(event.currentTarget.value);
            else manuallyEditing = true;
          }}
          onKeyUp={() => (manuallyEditing = false)}
          onChange={(event) =>
            updateDateAndRerenderUnlessStillTyping(event.currentTarget.value)
          }
        />
      </h3>
      {lessons.length === 0 ? (
        <h3>Geen lessen op deze dag</h3>
      ) : user.isTeacher() ? (
        <DisplayGroup
          chosenLesson={lessons[0]}
          dateAsString={toYYYYMMDD(lastDate)}
        />
      ) : (
        <ol>
          {lessons
            .sort((a, b) => a.groupName.localeCompare(b.groupName))
            .map((currentLesson) => (
              <li key={currentLesson.groupName}>
                <DisplayGroup
                  chosenLesson={currentLesson}
                  dateAsString={toYYYYMMDD(lastDate)}
                />
              </li>
            ))}
        </ol>
      )}
    </>
  );
};

export default DisplayAttendancesOnDate;
