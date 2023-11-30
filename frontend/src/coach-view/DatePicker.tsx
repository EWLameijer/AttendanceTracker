import { useEffect, useState } from "react";
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from "../utils"
import axios from "axios";
import { Class, addExtraData } from "../Class";
import GroupElement from "./GroupElement";

let lastDate = new Date(); // there may be a better way than this...

const DatePicker = (props: { isCoach: boolean }) => {
    const [classes, setClasses] = useState<Class[]>([])

    useEffect(() => {
        const dateAsString = toYYYYMMDD(lastDate);
        loadDate(dateAsString);
    }, []);

    function loadDate(dateAsString: string, postfix: string = "") {
        if (props.isCoach) {
            axios.get<Class[]>(`${BASE_URL}/coach-view/juan/dates/${dateAsString}${postfix}`).then(response => {
                const rawClasses = response.data;
                for (const rawClass of rawClasses) {
                    const fullFormatAttendances = rawClass.attendances.map(attendance => addExtraData(attendance))
                    rawClass.attendances = fullFormatAttendances
                }
                if (rawClasses[0].attendances[0].date) lastDate = new Date(Date.parse(rawClasses[0].attendances[0].date));
                setClasses(rawClasses);
            });
        }
    }

    const getDisplayedDay = () => classes[0].attendances[0].date ? new Date(Date.parse(classes[0].attendances[0].date)) : lastDate

    const previousLessonDay = () => {
        const dateAsString = toYYYYMMDD(getDisplayedDay());
        loadDate(dateAsString, "/previous")
    }

    const nextLessonDay = () => {
        const dateAsString = toYYYYMMDD(getDisplayedDay());
        loadDate(dateAsString, "/next")
    }

    return classes.length == 0 ? <></> : <>
        <h3><button onClick={previousLessonDay}>Vorige lesdag</button>
            {capitalize(getDisplayedDay().toLocaleDateString("nl-NL", dateOptions))}
            <button onClick={nextLessonDay}>Volgende lesdag</button></h3 >
        <ol>{classes.sort((a, b) => a.groupName.localeCompare(b.groupName)).map(currentClass =>
            <li key={currentClass.groupName}><GroupElement chosenClass={currentClass} personnelName='Juan' isCoach={true} /></li>)}</ol>
    </>
}

export default DatePicker;