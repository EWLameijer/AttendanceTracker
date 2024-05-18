import { useContext } from "react";
import DatePicker from "../coach-view/DatePicker";
import UserContext from "../context/UserContext";

const TeacherView = () => {
  const loginData = useContext(UserContext);

  const showAll: boolean = true;

  return (
    <>
      <h2>Hallo {loginData.username}!</h2>
      <p>
        <input type="checkbox" checked={showAll}></input>
        Toon alle groepen
      </p>
      <DatePicker showAllGroupsForTeacher={showAll} />
    </>
  );
};

export default TeacherView;
