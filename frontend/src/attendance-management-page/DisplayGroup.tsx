import axios from "axios";
import { Attendance, Lesson, Status, addExtraData } from "../-shared/Lesson.ts";
import { BASE_URL } from "../-shared/utils.ts";
import EditAttendance from "./EditAttendance.tsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../-shared/UserContext.ts";

const DisplayGroup = (props: {
  chosenLesson: Lesson;
  dateAsString: string;
}) => {
  const [chosenLesson, setChosenLesson] = useState(props.chosenLesson);
  useEffect(() => setChosenLesson(props.chosenLesson), [props.chosenLesson]);
  const user = useContext(UserContext);

  const updateAttendances = (updatedAttendances: Attendance[]) => {
    const newAttendances = [...chosenLesson.attendances];
    for (const updatedAttendance of updatedAttendances) {
      const studentIndex = chosenLesson.attendances.findIndex(
        (attendance) => attendance.studentName === updatedAttendance.studentName
      );
      newAttendances[studentIndex] = updatedAttendance;
    }
    setChosenLesson({ ...chosenLesson!, attendances: newAttendances });
  };

  const isUpdated = (attendance: Attendance) => {
    const originalAttendance = chosenLesson.attendances.find(
      (savedAttendance) =>
        savedAttendance.studentName === attendance.studentName
    )!;
    return (
      attendance.note !== originalAttendance.note ||
      attendance.status !== originalAttendance.status
    );
  };

  const saveModifiedAttendances = (attendances: Attendance[]) => {
    if (
      attendances.some(
        (attendance) => attendance.status === Status.NOT_REGISTERED_YET
      )
    )
      return;

    const updatedAttendances = attendances.filter(isUpdated);

    if (!updatedAttendances.length) return;

    const formattedAttendances = updatedAttendances.map((attendance) => {
      const newAttendance: Attendance = {
        studentName: attendance.studentName,
        status: attendance.status,
        registrarName: user.username,
        date: props.dateAsString,
      };
      const note = attendance.note;
      if (note) newAttendance.note = note;
      return newAttendance;
    });

    axios
      .post<Attendance[]>(`${BASE_URL}/attendances`, formattedAttendances, {
        auth: { username: user.username, password: user.password },
      })
      .then((response) => {
        const basicAttendances = response.data;
        const extendedAttendances = basicAttendances.map((attendance) =>
          addExtraData(attendance)
        );
        updateAttendances(extendedAttendances);
      });
  };

  const setAllUnregisteredAsPresent = () => {
    const newAttendances = chosenLesson!.attendances
      .filter(
        (attendance) => attendance.savedStatus === Status.NOT_REGISTERED_YET
      )
      .map((attendance) => ({ ...attendance, status: Status.PRESENT }));
    saveModifiedAttendances(newAttendances);
  };

  const unregisteredAttendancesExist = () =>
    chosenLesson!.attendances.some(
      (attendance) => attendance.status === Status.NOT_REGISTERED_YET
    );

  return (
    <>
      <h3>
        {chosenLesson.groupName}
        {user.isTeacher() ? "" : ` (${chosenLesson.teacherName})`}
      </h3>
      <button
        onClick={setAllUnregisteredAsPresent}
        disabled={!unregisteredAttendancesExist()}
      >
        Zet alle ongeregistreerden op aanwezig
      </button>
      <ol>
        {chosenLesson.attendances
          .sort((a, b) => a.studentName.localeCompare(b.studentName))
          .map((attendance) => (
            <EditAttendance
              key={attendance.studentName}
              attendance={attendance}
              saveIfModified={(attendance) =>
                saveModifiedAttendances([attendance])
              }
            />
          ))}
      </ol>
    </>
  );
};

export default DisplayGroup;
