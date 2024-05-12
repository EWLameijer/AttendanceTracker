import React, { useState } from "react";
import { Teacher } from "./Teacher";

const DayTeacher = (props: {
  updateTeacherIdForADay: (
    dayNumber: number,
    teacherId: string,
    isActive: boolean
  ) => void;
  dayIndex: number;
  day: string;
  teachers: Teacher[];
}) => {
  const [teacherId, setTeacherId] = useState<string>(props.teachers[0].id);
  const [isChecked, setIsChecked] = useState(false);

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeacherId(event.target.value);
    props.updateTeacherIdForADay(props.dayIndex, event.target.value, isChecked);
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
            props.updateTeacherIdForADay(
              props.dayIndex,
              teacherId,
              newCheckState
            );
          }}
        />
        {props.day}
      </label>
      <select onChange={handleTeacherChange}>
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
