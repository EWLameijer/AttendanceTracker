import { useParams } from "react-router-dom";
import {
  Attendance,
  Status,
  statusIsLate,
  translateAttendanceStatus,
} from "./Class";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, toYYYYMMDD } from "./utils";

const HistoryView = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>(
    []
  );
  const { name } = useParams();

  useEffect(() => {
    axios.get(`${BASE_URL}/students/${name}`).then((response) => {
      const studentId = response.data.id;
      axios
        .get(`${BASE_URL}/coach-view/juan/students/${studentId}`)
        .then((response) => {
          setAttendances(response.data);
          setFilteredAttendances(response.data);
        });
    });
  }, [name]);

  const showAttendancesFromDateOnwards = (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>
    setFilteredAttendances(
      attendances.filter((attendance) => attendance.date >= event.target.value)
    );

  const showAllAttendances = () => setFilteredAttendances(attendances);

  /* ITvitae schedules classes in periods of 12 weeks, which is 84 days. */
  const showAttendancesOfPastQuarter = () => {
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 84));
    const isoDate = toYYYYMMDD(priorDate);

    setFilteredAttendances(
      attendances.filter((attendance) => attendance.date >= isoDate)
    );
  };

  const late = filteredAttendances.filter((attendance) =>
    statusIsLate(attendance.status)
  ).length;

  const getCount = (status: string) =>
    filteredAttendances.filter((attendance) => attendance.status == status)
      .length;

  const timely = getCount(Status.PRESENT);

  const present = timely + late;

  const fromHome = getCount(Status.WORKING_FROM_HOME);

  const sick = getCount(Status.SICK);

  const withoutNotice = getCount(Status.ABSENT_WITHOUT_NOTICE);

  const withNotice = getCount(Status.ABSENT_WITH_NOTICE);

  const total = filteredAttendances.length;

  const toPercentage = (part: number, whole: number) =>
    Math.round((part * 100) / whole) + "%";

  const totalAbsence = withoutNotice + sick + withNotice;

  const display = (tag: string, value: number) => (
    <p key={tag}>
      {tag}: {value}/{total} = {toPercentage(value, total)}
    </p>
  );

  const categories = new Map<string, number>([
    ["Aanwezig (totaal)", present],
    [" - Aanwezig (op tijd)", timely],
    [" - Aanwezig (te laat)", late],
    ["Thuiswerkend (totaal)", fromHome],
    ["Afwezig (totaal)", totalAbsence],
    [" - Zonder bericht", withoutNotice],
    [" - Ziek", sick],
    [" - Met bericht", withNotice],
  ]);

  const getNote = (note: string | undefined) => (note ? ` (${note})` : "");

  return (
    <>
      <h2>Aanwezigheidsgeschiedenis van {name}</h2>

      <p>
        Vanaf:
        <input type="date" onChange={showAttendancesFromDateOnwards}></input>
      </p>

      <button onClick={showAllAttendances}>Toon alles</button>

      <button onClick={showAttendancesOfPastQuarter}>
        Toon laatste 12 weken
      </button>

      {[...categories.entries()].map((entry) => display(entry[0], entry[1]))}

      <ol>
        {filteredAttendances
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((attendance) => (
            <li key={attendance.date}>
              {attendance.date}: {translateAttendanceStatus(attendance.status)}
              {getNote(attendance.note)}
            </li>
          ))}
      </ol>
    </>
  );
};

export default HistoryView;
