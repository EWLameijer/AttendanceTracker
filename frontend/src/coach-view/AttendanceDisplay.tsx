import { useContext, useEffect, useState } from "react";
import { Attendance, Status, displayAttendance, isUnsaved } from "../Class.ts";
import { useNavigate } from "react-router-dom";

import "../styles.css";
import UserContext from "../context/UserContext.ts";

const AttendanceDisplay = (props: {
  attendance: Attendance;
  updateAttendance: (attendances: Attendance[]) => void;
  saveAttendances: (attendance: Attendance[]) => void;
}) => {
  const [attendance, setAttendance] = useState<Attendance>(props.attendance);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => setAttendance(props.attendance), [props.attendance]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.saveAttendances([attendance]);
  };

  const showHistory = () =>
    navigate(`/students/${props.attendance.studentName}`);

  const changeItem = (event: React.FormEvent<HTMLInputElement>) => {
    const newAttendance = {
      ...attendance,
      [event.currentTarget.name]: event.currentTarget.value,
    };
    props.updateAttendance([newAttendance]);
    setAttendance(newAttendance);
  };

  const getAttendanceStyle = (status: string) => attendanceStyle.get(status);

  const attendanceStyle = new Map<string, string>([
    [Status.ABSENT_WITH_NOTICE, "input-attendance-absent-with-notice"],
    [Status.ABSENT_WITHOUT_NOTICE, "input-attendance-absent-without-notice"],
    [Status.LATE, "input-attendance-late"],
    [Status.PRESENT, "input-attendance-present"],
    [Status.WORKING_FROM_HOME, "input-attendance-working-from-home"],
    [Status.SICK, "input-attendance-sick"],
  ]);

  return (
    <li>
      {displayAttendance(attendance)}
      <div className="left-box">
        <form onSubmit={submit}>
          <input
            className={getAttendanceStyle(attendance.status)}
            value={attendance.currentStatusAbbreviation}
            name="currentStatusAbbreviation"
            onChange={changeItem}
          />
          <input
            value={attendance.note}
            name="note"
            onChange={changeItem}
            placeholder="aantekeningen"
          />
          <input
            type="submit"
            disabled={!isUnsaved(attendance)}
            value="Opslaan"
          ></input>
        </form>
        {!user.isTeacher() ? (
          <button onClick={showHistory}>Geschiedenis</button>
        ) : (
          <></>
        )}
      </div>
    </li>
  );
};

export default AttendanceDisplay;
