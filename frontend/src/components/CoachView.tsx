import { useContext } from "react";
import DatePicker from "../coach-view/DatePicker";
import UserContext from "../context/UserContext";

const CoachView = () => {
  const user = useContext(UserContext);
  return (
    <>
      <h2>Hallo {user.username}!</h2>
      <DatePicker isCoach={true} />
    </>
  );
};

export default CoachView;
