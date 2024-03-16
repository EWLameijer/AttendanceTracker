import { useContext, useEffect, useState } from "react";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import axios from "axios";
import { Class, addExtraData } from "../Class";
import GroupElement from "./GroupElement";
import UserContext from "../context/UserContext";

// there may be a better way than this... But state is not sufficient, as useState resets the date to today whenever I return from another page, like history
let lastDate = new Date();

interface DateSchedule {
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

  useEffect(() => {
    const dateAsString = toYYYYMMDD(lastDate);
    loadDate(dateAsString);
  }, []);

  function loadDate(dateAsString: string) {
    const pathStart = user.isTeacher() ? "teacher-view" : "coach-view";
    axios
      .get<DateSchedule>(`${BASE_URL}/${pathStart}/${dateAsString}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        const schedule = response.data;
        setPreviousDate(schedule.previousDate);
        setNextDate(schedule.nextDate);
        lastDate = new Date(Date.parse(schedule.currentDate));
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
    <></>
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
                  personnelName={user.username}
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
