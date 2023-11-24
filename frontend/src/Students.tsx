import axios from 'axios';
import { useState, useEffect } from 'react';

interface Student {
    name: string
}

const Students = () => {
    const [students, setStudents] = useState<Student[]>([])
    useEffect(() => {
        axios.get("http://localhost:8080/students").then(response => {
            setStudents(response.data);
        });
    }, []);

    return <ol>{students.map(student => <li key={student.name}>{student.name}</li>)}</ol>
}

export default Students;