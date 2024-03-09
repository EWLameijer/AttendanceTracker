import { useContext } from "react";
import DatePicker from "../coach-view/DatePicker";
import UserContext from "../context/UserContext";
import Role from "./shared/Role";
import { useNavigate } from "react-router-dom";

const CoachView = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <h2>Hallo {user.username}!</h2>
      {user.role == Role.ADMIN ? (
        <>
          <button onClick={() => navigate("/admin-view")}>
            Wijzig groepen
          </button>
          <button onClick={() => navigate("/schedule-view")}>
            Plan lessen
          </button>
        </>
      ) : (
        <></>
      )}
      <DatePicker isCoach={true} />
    </>
  );
};

export default CoachView;
