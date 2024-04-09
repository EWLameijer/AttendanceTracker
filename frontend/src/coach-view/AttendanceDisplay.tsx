import { useContext, useEffect, useState } from "react";
import { Attendance, Status, translateAttendanceStatus } from "../Class.ts";
import { useNavigate } from "react-router-dom";

import "../styles.css";
import UserContext from "../context/UserContext.ts";

const AttendanceDisplay = (props: {
  attendance: Attendance;
  saveIfModified: (attendance: Attendance) => void;
}) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const [currentNote, setCurrentNote] = useState(props.attendance.note);
  const [currentStatus, setCurrentStatus] = useState(props.attendance.status);
  // need useEffect else a teacher setting all as present won't work!
  useEffect(() => {
    setCurrentNote(props.attendance.note);
    setCurrentStatus(props.attendance.status);
  }, [props.attendance.note, props.attendance.status]);

  const showHistory = () =>
    navigate(`/students/${props.attendance.studentName}`);

  const getAttendanceStyle = (status: string) => attendanceStyle.get(status);

  const attendanceStyle = new Map<string, string>([
    [Status.ABSENT_WITH_NOTICE, "input-attendance-absent-with-notice"],
    [Status.ABSENT_WITHOUT_NOTICE, "input-attendance-absent-without-notice"],
    [Status.LATE, "input-attendance-late"],
    [Status.PRESENT, "input-attendance-present"],
    [Status.WORKING_FROM_HOME, "input-attendance-working-from-home"],
    [Status.SICK, "input-attendance-sick"],
  ]);

  const sortedStatuses = Object.keys(Status)
    .filter(
      (key) =>
        key !== Status.NOT_REGISTERED_YET ||
        props.attendance.savedStatus === Status.NOT_REGISTERED_YET
    )
    .map((key) => [key, translateAttendanceStatus(key)])
    .sort((a, b) => a[1]!.localeCompare(b[1]!));

  function formatTime(timeOfRegistration: string) {
    const date = new Date(timeOfRegistration);
    return `${date.getDate()}/${
      date.getMonth() + 1
    } om ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  const displayAttendance = (attendance: Attendance) =>
    `${attendance.studentName}` +
    (attendance.personnelName
      ? ` - geregistreerd door ${attendance.personnelName} (${formatTime(
          attendance.timeOfRegistration!
        )})`
      : "");

  const saveIfModified = () =>
    props.saveIfModified({
      ...props.attendance,
      note: currentNote,
      status: currentStatus,
    });

  return (
    <li>
      {displayAttendance(props.attendance)}
      <div className="left-box">
        <select
          value={currentStatus}
          onChange={(event) => setCurrentStatus(event.currentTarget.value)}
          onBlur={saveIfModified}
          className={getAttendanceStyle(currentStatus)}
        >
          {sortedStatuses.map(([status, dutchTranslation]) => (
            <option
              key={status}
              value={status}
              className={getAttendanceStyle(status)}
            >
              {dutchTranslation}
            </option>
          ))}
        </select>
        <input
          value={currentNote}
          onChange={(event) => setCurrentNote(event.currentTarget.value)}
          onBlur={saveIfModified}
          placeholder="aantekeningen"
          disabled={currentStatus === Status.NOT_REGISTERED_YET}
        />
        {!user.isTeacher() && (
          <button onClick={showHistory}>Geschiedenis</button>
        )}
      </div>
    </li>
  );
};

export default AttendanceDisplay;
