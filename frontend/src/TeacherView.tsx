import axios from 'axios';
import { useState, useEffect } from 'react';
import { Class } from './Class';
import GroupElement from './GroupElement';

const TeacherView = () => {
    const [chosenClass, setChosenClass] = useState<Class>()

    useEffect(() => {
        axios.get('http://localhost:8080/dates/2023-11-27/teachers/wubbo').then(response => {
            setChosenClass(response.data);
        });
    }, []);

    return chosenClass ? <>
        <h2>Hallo Wubbo!</h2>
        <GroupElement currentClass={chosenClass} personnelName='Wubbo' />
    </> : <p>Loading...</p>
}

export default TeacherView;