import { useContext } from "react";
import DatePicker from "./DatePicker";
import UserContext from "../login-page/UserContext";

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
