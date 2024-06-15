import axios from "axios";
import { Attendance, Class, Status, addExtraData } from "../-shared/Class.ts";
import { BASE_URL } from "../-shared/utils.ts";
import AttendanceDisplay from "./AttendanceDisplay.tsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../-shared/UserContext.ts";

const GroupElement = (props: { chosenClass: Class; dateAsString: string }) => {
  const [chosenClass, setChosenClass] = useState(props.chosenClass);
  useEffect(() => setChosenClass(props.chosenClass), [props.chosenClass]);
  const user = useContext(UserContext);

  const updateAttendances = (updatedAttendances: Attendance[]) => {
    const newAttendances = [...chosenClass.attendances];
    for (const updatedAttendance of updatedAttendances) {
      const studentIndex = chosenClass.attendances.findIndex(
        (attendance) => attendance.studentName === updatedAttendance.studentName
      );
      newAttendances[studentIndex] = updatedAttendance;
    }
    setChosenClass({ ...chosenClass!, attendances: newAttendances });
  };

  const isUpdated = (attendance: Attendance) => {
    const originalAttendance = chosenClass.attendances.find(
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
        (attendance) => attendance.status == Status.NOT_REGISTERED_YET
      )
    )
      return;

    const updatedAttendances = attendances.filter(isUpdated);

    if (updatedAttendances.length == 0) return;

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
    const newAttendances = chosenClass!.attendances
      .filter(
        (attendance) => attendance.savedStatus === Status.NOT_REGISTERED_YET
      )
      .map((attendance) => ({ ...attendance, status: Status.PRESENT }));
    saveModifiedAttendances(newAttendances);
  };

  const unregisteredAttendancesExist = () =>
    chosenClass!.attendances.some(
      (attendance) => attendance.status == Status.NOT_REGISTERED_YET
    );

  return (
    <>
      <h3>
        {chosenClass.groupName}
        {user.isTeacher() ? "" : ` (${chosenClass.teacherName})`}
      </h3>
      {user.isTeacher() ? (
        <button
          onClick={setAllUnregisteredAsPresent}
          disabled={!unregisteredAttendancesExist()}
        >
          Zet alle ongeregistreerden op aanwezig
        </button>
      ) : (
        <></>
      )}
      <ol>
        {chosenClass.attendances
          .sort((a, b) => a.studentName.localeCompare(b.studentName))
          .map((attendance) => (
            <AttendanceDisplay
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

export default GroupElement;
