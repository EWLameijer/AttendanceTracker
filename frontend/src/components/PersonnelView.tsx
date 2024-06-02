import axios from "axios";
import UserContext from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { BASE_URL, FRONTEND_URL, byName } from "../utils";
import Role from "./shared/Role";
import { Teacher } from "../schedule-view/Teacher";

interface Registrar {
  id: string;
  name: string;
  role: string;
}

const PersonnelView = () => {
  const user = useContext(UserContext);

  // Let's start with getting all personnel/registrars with role
  // Then get all external teachers
  // Then get all invitations
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invitees, setInvitees] = useState<Registrar[]>([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/personnel`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setRegistrars(response.data);
      });
    axios
      .get(`${BASE_URL}/personnel/teachers`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => {
        setTeachers(response.data);
      });
    axios
      .get<Registrar[]>(`${BASE_URL}/invitations`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => setInvitees(response.data));
  }, []);

  const invite = (dutchTitle: string, backendTitle: string) => {
    const name = prompt(
      `Geef de naam van de ${dutchTitle} om uit te nodigen:`
    )?.trim();
    if (!name) {
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
        setInvitees([
          ...invitees,
          {
            id: response.data.code,
            name,
            role: backendTitle === "teacher" ? Role.TEACHER : Role.ADMIN,
          },
        ]);
      })
      .catch(() => alert("Deze gebruiker bestaat al!"));
  };

  const inviteTeacher = () => invite("docent", "teacher");

  const inviteCoachOrAdmin = () =>
    invite("coach of administrator", "coach-or-admin");

  const addExternalTeacher = () => {
    const name = prompt(
      `Geef de naam van de externe docent om toe te voegen aan de lijst docenten die ingeroosterd kunnen worden:`
    )?.trim();
    if (!name) {
      alert("Geen naam opgegeven!");
      return;
    }
    axios
      .post(
        `${BASE_URL}/teachers`,
        { name },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then(() => alert("Externe docent aangemaakt!"))
      .catch(() => alert("Deze gebruiker bestaat al!"));
  };

  const registeredTeachers = registrars
    .filter((registrar) => registrar.role == Role.TEACHER)
    .sort(byName);

  const admins = registrars
    .filter((registrar) => registrar.role == Role.ADMIN)
    .sort(byName);

  const registeredTeacherNames = registeredTeachers.map(
    (registeredTeacher) => registeredTeacher.name
  );

  const externalTeachers = teachers
    .filter((teacher) => !registeredTeacherNames.includes(teacher.name))
    .sort(byName);

  const inviteesForDisplay = invitees
    .map((invitee) => ({
      ...invitee,
      role: invitee.role == Role.TEACHER ? "docent" : "administrator",
    }))
    .sort(byName);

  return (
    <>
      <button onClick={inviteTeacher}>Nodig docent uit</button>
      <button onClick={inviteCoachOrAdmin}>Nodig coach/admin uit</button>
      <button onClick={addExternalTeacher}>
        Voeg externe docent toe die zich nog niet hoeft te registreren
      </button>
      <h3>Docenten (die aanwezigheid kunnen registreren)</h3>
      <ul>
        {registeredTeachers.map((registeredTeacher) => (
          <li key={registeredTeacher.id}>{registeredTeacher.name}</li>
        ))}
      </ul>
      <h3>
        Externe docenten (die geen aanwezigheid kunnen registreren, maar wel
        kunnen worden toegekend aan klassen)
      </h3>
      <ul>
        {externalTeachers.map((externalTeacher) => (
          <li key={externalTeacher.id}>{externalTeacher.name}</li>
        ))}
      </ul>
      <h3>Administratoren</h3>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>{admin.name}</li>
        ))}
      </ul>
      <h3>Uitgenodigden</h3>
      <ul>
        {inviteesForDisplay.map((invitee) => (
          <li key={invitee.id}>
            {invitee.name} ({invitee.role})
          </li>
        ))}
      </ul>
    </>
  );
};

export default PersonnelView;
