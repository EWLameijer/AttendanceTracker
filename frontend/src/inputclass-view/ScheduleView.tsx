import axios from 'axios';
import { useState, useEffect } from 'react';
import { Attendance, Class, addExtraData } from '../Class';
import { BASE_URL, capitalize, dateOptions, toYYYYMMDD } from '../utils';

const ScheduleView = () => {
    const [chosenClass, setChosenClass] = useState<Class>()
    const [date, setDate] = useState<Date | undefined>()

    return  <>
        <h2>Hallo!</h2>
        <h3>Voer nieuwe les in:</h3 >
    </>
}

export default ScheduleView;