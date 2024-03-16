import { useContext } from "react";
import DatePicker from "../coach-view/DatePicker";
import UserContext from "../context/UserContext";

const TeacherView = () => {
  const loginData = useContext(UserContext);

  return (
    <>
      <h2>Hallo {loginData.username}!</h2>
      <DatePicker />
    </>
  );
};

export default TeacherView;
