import { useContext, useEffect, useState } from "react";
import {
  BASE_URL,
  capitalize,
  dateOptions,
  toYYYYMMDD,
} from "../-shared/utils";
import axios from "axios";
import { Class, addExtraData } from "../-shared/Class";
import GroupElement from "./GroupElement";
import UserContext from "../-shared/UserContext";

// there may be a better way than this... But state is not sufficient, as useState resets the date to today whenever I return from another page, like history
let lastDate = new Date();

interface DateSchedule {
  timeOfLatestUpdate: string;
  previousDate?: string;
  currentDate: string;
  nextDate?: string;
  classes: Class[];
}

const DatePicker = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [previousDate, setPreviousDate] = useState<string | undefined>();
  const [nextDate, setNextDate] = useState<string | undefined>();

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

  function loadDate(dateAsString: string, byPicker: boolean = false) {
    axios
      .get<DateSchedule>(`${BASE_URL}/attendances/by-date/${dateAsString}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        const schedule = response.data;
        latestUpdateProcessed = schedule.timeOfLatestUpdate;
        setPreviousDate(schedule.previousDate);
        setNextDate(schedule.nextDate);
        const returnedDateAsString = schedule.currentDate;
        if (byPicker && returnedDateAsString !== dateAsString)
          alert(`Geen les gevonden op ${dateAsString}`);
        lastDate = new Date(Date.parse(returnedDateAsString));
        const rawClasses = schedule.classes;
        for (const rawClass of rawClasses) {
          const fullFormatAttendances = rawClass.attendances.map((attendance) =>
            addExtraData(attendance)
          );
          rawClass.attendances = fullFormatAttendances;
        }
        setClasses(rawClasses);
      });
  }

  const getDisplayedDay = () => lastDate;

  const previousLessonDay = () => loadDate(previousDate!);

  const nextLessonDay = () => loadDate(nextDate!);

  return classes.length == 0 ? (
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
          value={toYYYYMMDD(lastDate)}
          onChange={(event) => loadDate(event.currentTarget.value, true)}
        />
      </h3>
      {user.isTeacher() ? (
        <GroupElement
          chosenClass={classes[0]}
          dateAsString={toYYYYMMDD(lastDate)}
        />
      ) : (
        <ol>
          {classes
            .sort((a, b) => a.groupName.localeCompare(b.groupName))
            .map((currentClass) => (
              <li key={currentClass.groupName}>
                <GroupElement
                  chosenClass={currentClass}
                  dateAsString={toYYYYMMDD(lastDate)}
                />
              </li>
            ))}
        </ol>
      )}
    </>
  );
};

export default DatePicker;
