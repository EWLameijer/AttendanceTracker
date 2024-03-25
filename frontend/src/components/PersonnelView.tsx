import axios from "axios";
import UserContext from "../context/UserContext";
import { useContext } from "react";
import { BASE_URL, FRONTEND_URL } from "../utils";

const PersonnelView = () => {
  const user = useContext(UserContext);

  const invite = (dutchTitle: string, backendTitle: string) => {
    const name = prompt(`Geef de naam van de ${dutchTitle} om uit te nodigen:`);
    if (!name?.trim()) {
      alert("Geen naam opgegeven!");
      return;
    }
    axios
      .post(
        `${BASE_URL}/invitations/for-${backendTitle}`,
        { name },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        alert(
          `Stuur de ander de link '${FRONTEND_URL}/registration-view/${response.data.code}'. Deze blijft 24 uur geldig.`
        );
      })
      .catch(() => {
        alert("Deze gebruiker bestaat al!");
      });
  };

  const inviteTeacher = () => invite("docent", "teacher");

  const inviteCoachOrAdmin = () =>
    invite("coach of administrator", "coach-or-admin");

  return (
    <>
      <button onClick={inviteTeacher}>Nodig docent uit</button>
      <button onClick={inviteCoachOrAdmin}>Nodig coach/admin uit</button>
    </>
  );
};

export default PersonnelView;
