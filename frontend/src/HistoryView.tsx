import { useParams } from "react-router-dom";
import { Attendance, Status, statusIsLate, translateAttendanceStatus } from "./Class";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./utils";

const HistoryView = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const { name } = useParams();

    useEffect(() => {
        axios.get(`${BASE_URL}/students/${name}`).then(response => {
            const studentId = response.data.id;
            axios.get(`${BASE_URL}/coach-view/juan/students/${studentId}`).then(response => {
                setAttendances(response.data);
            });
        });
    }, [name]);

    const isLate = (status: string) => statusIsLate(status)

    const late = attendances.filter(attendance => isLate(attendance.status)).length;

    const getCount = (status: string) => attendances.filter(attendance => attendance.status == status).length

    const timely = getCount(Status.PRESENT);

    const present = timely + late;

    const fromHome = getCount(Status.WORKING_FROM_HOME);

    const sick = getCount(Status.SICK);

    const withoutNotice = getCount(Status.ABSENT_WITHOUT_NOTICE);

    const withNotice = getCount(Status.ABSENT_WITH_NOTICE);

    const total = attendances.length;

    const toPercentage = (part: number, whole: number) => Math.round(part * 100 / whole) + "%";

    const totalAbsence = withoutNotice + sick + withNotice;

    const display = (tag: string, value: number) => <p key={tag}>{tag}: {value}/{total} = {toPercentage(value, total)}</p>

    const categories = new Map<string, number>([
        ["Aanwezig (totaal)", present],
        [" - Aanwezig (op tijd)", timely],
        [" - Aanwezig (te laat)", late],
        ["Thuiswerkend (totaal)", fromHome],
        ["Afwezig (totaal)", totalAbsence],
        [" - Zonder bericht", withoutNotice],
        [" - Ziek", sick],
        [" - Met bericht", withNotice]
    ]);

    const getNote = (note: string | undefined) => note ? ` (${note})` : ""

    return <>
        <h2>Aanwezigheidsgeschiedenis van {name}</h2>
        {[...categories.entries()].map(entry => display(entry[0], entry[1]))}

        <ol>{attendances.sort((a, b) => b.date.localeCompare(a.date)).map(attendance =>
            <li key={attendance.date}>{attendance.date}: {translateAttendanceStatus(attendance.status)}{getNote(attendance.note)}</li>)}</ol>
    </>
}

export default HistoryView;