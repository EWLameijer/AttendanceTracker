import { useContext } from "react";
import DatePicker from "./DatePicker";
import UserContext from "../-shared/UserContext";
import { useNavigate } from "react-router-dom";

const CoachView = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <h2>Hallo {user.username}!</h2>
      <>
        <button onClick={() => navigate("/admin-view")}>Wijzig groepen</button>
        <button onClick={() => navigate("/schedule-view")}>Plan lessen</button>
        <button onClick={() => navigate("/personnel-view")}>
          Beheer gebruikers
        </button>
      </>
      <DatePicker />
    </>
  );
};

export default CoachView;
