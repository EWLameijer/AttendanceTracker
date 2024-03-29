import React, { useState } from "react";
import { Teacher } from "./Teacher";

const DayTeacher = (props: {
  updateDayTeacher: (
    dayNumber: number,
    teacherId: string,
    isActive: boolean
  ) => void;
  dayIndex: number;
  day: string;
  //onCheckboxChange: React.ChangeEventHandler<HTMLInputElement>;
  teachers: Teacher[];
}) => {
  const [teacherId, setTeacherId] = useState<string>(props.teachers[0].id);
  const [isChecked, setIsChecked] = useState(false);

  //  if (props.teachers?.[0]) setTeacherId(props.teachers[0].id);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeacherId(event.target.value);
    props.updateDayTeacher(props.dayIndex, event.target.value, isChecked);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name={props.day}
          checked={isChecked}
          onChange={() => {
            const newCheckState = !isChecked;
            setIsChecked(newCheckState);
            props.updateDayTeacher(props.dayIndex, teacherId, newCheckState);
          }}
        />
        {props.day}
      </label>
      <select name="teacher" onChange={handleTeacherChange}>
        {props.teachers.map((teacher: Teacher, index: number) => (
          <option key={index} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default DayTeacher;
