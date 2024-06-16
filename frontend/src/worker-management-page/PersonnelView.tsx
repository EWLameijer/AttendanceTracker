import axios from "axios";
import UserContext from "../-shared/UserContext";
import { useContext, useEffect, useState } from "react";
import { BASE_URL, FRONTEND_URL, Registrar, byName } from "../-shared/utils";
import Role from "../-shared/Role";
import { Teacher } from "../-shared/Teacher";
import RegistrarList from "./RegistrarList";

const PersonnelView = () => {
  const user = useContext(UserContext);

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
          `Stuur de ander de link ${FRONTEND_URL}/registration-view/${response.data.code} Deze blijft 24 uur geldig.`
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

  const inviteCoach = () => invite("studentbegeleider", "coach");

  const inviteAdmin = () => invite("administrator", "admin");

  const inviteSuperAdmin = () => invite("super-administrator", "super-admin");

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
      .then((response) => {
        alert("Externe docent aangemaakt!");
        setTeachers([...teachers, response.data]);
      })
      .catch(() => alert("Deze gebruiker bestaat al!"));
  };

  const byRoleSorted = (role: string) =>
    registrars.filter((registrar) => registrar.role == role).sort(byName);

  const registeringTeachers = byRoleSorted(Role.TEACHER);

  const admins = byRoleSorted(Role.ADMIN);

  const coaches = byRoleSorted(Role.COACH);

  const superAdmins = byRoleSorted(Role.SUPER_ADMIN);

  const registeringTeacherNames = registeringTeachers.map(
    (registeredTeacher) => registeredTeacher.name
  );

  const externalTeachers = teachers
    .filter((teacher) => !registeringTeacherNames.includes(teacher.name))
    .sort(byName);

  const roleNames = {
    [Role.TEACHER]: "docent",
    [Role.COACH]: "studentbegeleider",
    [Role.ADMIN]: "administrator",
    [Role.SUPER_ADMIN]: "super-administrator",
  };

  const inviteesForDisplay = invitees
    .map((invitee) => ({
      ...invitee,
      role: roleNames[invitee.role],
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

  const withdrawInvitation = (id: string) => {
    setInvitees(invitees.filter((invitee) => invitee.id !== id));
  };

  const superAdminDisable = user.isSuperAdmin() ? disableRegistrar : undefined;

  return (
    <>
      <button onClick={inviteTeacher}>Nodig docent uit</button>
      <button onClick={inviteCoach}>Nodig coach uit</button>
      {user.isSuperAdmin() && (
        <>
          <button onClick={inviteAdmin}>Nodig administrator uit</button>
          <button onClick={inviteSuperAdmin}>
            Nodig super-administrator uit
          </button>
        </>
      )}
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
        title="Coaches"
        registrars={coaches}
        disableRegistrar={disableRegistrar}
      />
      <RegistrarList
        title="Administratoren"
        registrars={admins}
        disableRegistrar={superAdminDisable}
      />
      <RegistrarList
        title="Super-administratoren"
        registrars={superAdmins}
        disableRegistrar={superAdminDisable}
      />
      <h3>Uitgenodigden</h3>
      <ul>
        {inviteesForDisplay.map((invitee) => (
          <li key={invitee.name}>
            {invitee.name} ({invitee.role}){" "}
            <button onClick={() => withdrawInvitation(invitee.id)}>
              Uitnodiging intrekken
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PersonnelView;