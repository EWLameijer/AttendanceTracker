import { useContext } from "react";
import {
  Attendance,
  Status,
  isUnsaved,
  translateAttendanceStatus,
} from "../Class.ts";
import { useNavigate } from "react-router-dom";

import "../styles.css";
import UserContext from "../context/UserContext.ts";

const AttendanceDisplay = (props: {
  attendance: Attendance;
  updateAttendance: (attendances: Attendance[]) => void;
  saveAttendances: (attendance: Attendance[]) => void;
}) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // props.saveAttendances([props.attendance]);
  };

  const showHistory = () =>
    navigate(`/students/${props.attendance.studentName}`);

  const updateNotes = (event: React.FormEvent<HTMLInputElement>) => {
    const newAttendance: Attendance = {
      ...props.attendance,
      note: event.currentTarget.value,
    };
    props.saveAttendances([newAttendance]);
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

  const updateAttendanceType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newAttendance = {
      ...props.attendance,
      status: event.currentTarget.value,
    };
    props.saveAttendances([newAttendance]);
  };

  const sortedStatuses = Object.keys(Status)
    .filter(
      (key) =>
        key !== Status.NOT_REGISTERED_YET ||
        props.attendance.savedStatus === Status.NOT_REGISTERED_YET
    )
    .map((key) => [key, translateAttendanceStatus(key)])
    .sort((a, b) => a[1]!.localeCompare(b[1]!));

  return (
    <li>
      <div className="left-box">
        <form onSubmit={submit}>
          <select
            value={props.attendance.status}
            onChange={updateAttendanceType}
            className={getAttendanceStyle(props.attendance.status)}
          >
            {sortedStatuses.map(([status, dutchTranslation]) => (
              <option
                key={status}
                value={status}
                className={getAttendanceStyle(status!)}
              >
                {dutchTranslation}
              </option>
            ))}
          </select>
          <input
            value={props.attendance.note}
            onChange={updateNotes}
            placeholder="aantekeningen"
          />
          <input
            type="submit"
            disabled={!isUnsaved(props.attendance)}
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
