import { useContext } from "react";
import DatePicker from "./DatePicker";
import UserContext from "../-shared/UserContext";
import { useNavigate } from "react-router-dom";

const AttendanceManagement = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <h2>Hallo {user.username}!</h2>
      <>
        {user.isSuperAdmin() && (
          <>
            <button onClick={() => navigate("/group-management")}>
              Wijzig groepen
            </button>
            <button onClick={() => navigate("/lesson-management")}>
              Plan lessen
            </button>
          </>
        )}
        {user.isAnyAdmin() && (
          <button onClick={() => navigate("/worker-management")}>
            Beheer gebruikers
          </button>
        )}
      </>
      <DatePicker />
    </>
  );
};

export default AttendanceManagement;
