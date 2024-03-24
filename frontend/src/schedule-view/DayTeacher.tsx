import React from "react";
import { Teacher } from "./Teacher";

const DayTeacher = (props: {
  day: string;
  isSelected: boolean;
  onCheckboxChange: any;
  teachers: Teacher[];
  handleTeacherChange: any;
}) => (
  <div>
    <label>
      <input
        type="checkbox"
        name={props.day}
        checked={props.isSelected}
        onChange={props.onCheckboxChange}
      />
      {props.day}
    </label>
    <select id="teacher" name="teacher" onChange={props.handleTeacherChange}>
      {props.teachers.map((teacher: Teacher, index: number) => (
        <option key={index} value={teacher.id}>
          {teacher.name}
        </option>
      ))}
    </select>
  </div>
);

export default DayTeacher;
