import { useEffect, useState } from "react";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils";
import axios from "axios";
import { Class, addExtraData } from "../Class";
import GroupElement from "./GroupElement";

// there may be a better way than this... But state is not sufficient, as useState resets the date to today whenever I return from another page, like history
let lastDate = new Date();

interface DateSchedule {
  previousDate?: string;
  currentDate: string;
  nextDate?: string;
  classes: Class[];
}

const DatePicker = (props: { isCoach: boolean }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [previousDate, setPreviousDate] = useState<string | undefined>();
  const [nextDate, setNextDate] = useState<string | undefined>();

  useEffect(() => {
    const dateAsString = toYYYYMMDD(lastDate);
    loadDate(dateAsString);
  }, []);

  function loadDate(dateAsString: string) {
    const pathStart = props.isCoach ? "coach-view/juan" : "teacher-view/wubbo";
    axios
      .get<DateSchedule>(`${BASE_URL}/${pathStart}/dates/${dateAsString}`)
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
      {props.isCoach ? (
        <ol>
          {classes
            .sort((a, b) => a.groupName.localeCompare(b.groupName))
            .map((currentClass) => (
              <li key={currentClass.groupName}>
                <GroupElement
                  chosenClass={currentClass}
                  personnelName="Juan"
                  isCoach={true}
                  dateAsString={toYYYYMMDD(lastDate)}
                />
              </li>
            ))}
        </ol>
      ) : (
        <GroupElement
          chosenClass={classes[0]}
          personnelName="Wubbo"
          isCoach={false}
          dateAsString={toYYYYMMDD(lastDate)}
        />
      )}
    </>
  );
};

export default DatePicker;
