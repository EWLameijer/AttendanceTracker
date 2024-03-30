import axios from "axios";
import {
  Attendance,
  Class,
  Status,
  addExtraData,
  isUnsaved,
  unsavedAttendancesExist,
} from "../Class.ts";
import { BASE_URL, format, isValidAbbreviation } from "../utils.ts";
import AttendanceDisplay from "./AttendanceDisplay.tsx";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.ts";

const GroupElement = (props: { chosenClass: Class; dateAsString: string }) => {
  const [chosenClass, setChosenClass] = useState(props.chosenClass);
  useEffect(() => setChosenClass(props.chosenClass), [props.chosenClass]);
  const user = useContext(UserContext);

  const updateAttendance = (updatedAttendances: Attendance[]) => {
    const newAttendances = [...chosenClass.attendances];
    for (const updatedAttendance of updatedAttendances) {
      const studentIndex = chosenClass.attendances.findIndex(
        (attendance) => attendance.studentName === updatedAttendance.studentName
      );
      newAttendances[studentIndex] = updatedAttendance;
    }
    setChosenClass({ ...chosenClass!, attendances: newAttendances });
  };

  const saveAttendances = (attendances: Attendance[]) => {
    if (
      attendances.some(
        (attendance) => attendance.status == Status.NOT_REGISTERED_YET
      )
    )
      return;

    const formattedAttendances = attendances.map((attendance) => {
      const newAttendance: Attendance = {
        studentName: attendance.studentName,
        status: attendance.status,
        personnelName: user.username,
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
        updateAttendance(extendedAttendances);
      });
  };

  const setUnregisteredAsPresent = (attendance: Attendance): Attendance => {
    const newAttendance = { ...attendance };
    if (newAttendance.savedStatus === Status.NOT_REGISTERED_YET)
      newAttendance.status = Status.PRESENT;
    return newAttendance;
  };

  const saveAllNewentries = () =>
    saveAttendances(
      chosenClass.attendances.filter((attendance) => isUnsaved(attendance))
    );

  const setAllUnregisteredAsPresent = () => {
    const newAttendances = chosenClass!.attendances.map((attendance) =>
      setUnregisteredAsPresent(attendance)
    );
    setChosenClass({ ...chosenClass!, attendances: newAttendances });
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
              updateAttendance={updateAttendance}
              saveAttendances={saveAttendances}
            />
          ))}
      </ol>
      {user.isTeacher() ? (
        <button
          onClick={saveAllNewentries}
          disabled={!unsavedAttendancesExist(chosenClass)}
        >
          Stuur alle nieuwe registraties door
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default GroupElement;
