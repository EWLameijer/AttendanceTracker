import axios from "axios";
import UserContext from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { BASE_URL, FRONTEND_URL, Registrar, byName } from "../utils";
import Role from "./shared/Role";
import { Teacher } from "../schedule-view/Teacher";
import RegistrarList from "./personnel-view-components/RegistrarList";

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

  const registeringTeachers = registrars
    .filter((registrar) => registrar.role == Role.TEACHER)
    .sort(byName);

  const admins = registrars
    .filter((registrar) => registrar.role == Role.ADMIN)
    .sort(byName);

  const registeringTeacherNames = registeringTeachers.map(
    (registeredTeacher) => registeredTeacher.name
  );

  const externalTeachers = teachers
    .filter((teacher) => !registeringTeacherNames.includes(teacher.name))
    .sort(byName);

  const inviteesForDisplay = invitees
    .map((invitee) => ({
      ...invitee,
      role: invitee.role == Role.TEACHER ? "docent" : "administrator",
    }))
    .sort(byName);

  const disableRegistrar = (id: string) => {
    const name = registrars.find((registrar) => registrar.id === id)?.name;
    const reply = confirm(`Wilt u echt het account van ${name} deactiveren?`);
    if (reply) {
      axios
        .delete(`${BASE_URL}/personnel/${id}`, {
          auth: {
            username: user.username,
            password: user.password,
          },
        })
        .then(() => {
          alert(`Account van ${name} gedeactiveerd.`);
          setRegistrars(registrars.filter((registrar) => registrar.id !== id));
        })
        .catch(() => alert(`Kan account van ${name} niet deactiveren.`));
    }
  };

  const removeFromLessonPlanning = (id: string) => {
    const name = teachers.find((teacher) => teacher.id === id)?.name;
    const reply = confirm(`Wilt u echt geen lessen meer plannen met ${name}?`);
    if (reply) {
      axios
        .delete(`${BASE_URL}/teachers/${id}`, {
          auth: {
            username: user.username,
            password: user.password,
          },
        })
        .then(() => {
          alert(
            `${name} verwijderd van de lijst met in te roosteren docenten.`
          );
          setTeachers(teachers.filter((teacher) => teacher.id !== id));
        })
        .catch(() =>
          alert(
            `Kan ${name} niet verwijderen van de lijst met in te roosteren docenten.`
          )
        );
    }
  };

  return (
    <>
      <button onClick={inviteTeacher}>Nodig docent uit</button>
      <button onClick={inviteCoachOrAdmin}>Nodig coach/admin uit</button>
      <button onClick={addExternalTeacher}>
        Voeg externe docent toe die zich nog niet hoeft te registreren
      </button>
      <RegistrarList
        title="Docenten (die aanwezigheid kunnen registreren)"
        registrars={registeringTeachers}
        disableRegistrar={disableRegistrar}
      />
      <h3>
        Externe docenten (die geen aanwezigheid kunnen registreren, maar wel
        kunnen worden toegekend aan klassen)
      </h3>
      <ul>
        {externalTeachers.map((externalTeacher) => (
          <li key={externalTeacher.id}>
            {externalTeacher.name}
            <button
              onClick={() => removeFromLessonPlanning(externalTeacher.id)}
            >
              Verwijderen
            </button>
          </li>
        ))}
      </ul>
      <RegistrarList
        title="Administratoren"
        registrars={admins}
        disableRegistrar={disableRegistrar}
      />
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
