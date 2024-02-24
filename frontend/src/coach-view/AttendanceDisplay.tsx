import { useEffect, useState } from "react";
import {
  Attendance,
  Status,
  displayAttendance,
  isUnsaved,
  statusIsLate,
} from "../Class.ts";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const AttendanceDisplay = (props: {
  attendance: Attendance;
  personnelName: string;
  isCoach: boolean;
  updateAttendance: (attendances: Attendance[]) => void;
  saveAttendances: (attendance: Attendance[]) => void;
}) => {
  const [attendance, setAttendance] = useState<Attendance>(props.attendance);
  const navigate = useNavigate();

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

  function setAttendanceStyle(abbreviation: string) {
    return statusIsLate(abbreviation)
      ? "input-attendance-late"
      : attendanceStyle.get(abbreviation);
  }

  const attendanceStyle = new Map<string, string>([
    [Status.ABSENT_WITH_NOTICE, "input-attendance-absent-with-notice"],
    [Status.ABSENT_WITHOUT_NOTICE, "input-attendance-absent-without-notice"],
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
            type="text"
            className={setAttendanceStyle(attendance.status)}
            value={attendance.currentStatusAbbreviation}
            name="currentStatusAbbreviation"
            onChange={changeItem}
          />
          <input
            type="text"
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
        {props.isCoach ? (
          <button onClick={showHistory}>Geschiedenis</button>
        ) : (
          <></>
        )}
      </div>
    </li>
  );
};

export default AttendanceDisplay;
