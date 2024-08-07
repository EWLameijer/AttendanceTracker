import axios from "axios";
import UserContext from "../-shared/UserContext";
import { useContext, useEffect, useState } from "react";
import { BASE_URL, FRONTEND_URL, Registrar, byName } from "../-shared/utils";
import Role from "../-shared/Role";
import { Teacher } from "../-shared/Teacher";
import roleNames from "./roleNames";
import RegistrarList from "./RegistrarList";
import HomeButton from "../-shared/HomeButton";

interface Invitee extends Registrar {
  hasExpired: boolean;
  emailAddress: string;
}

const WorkerManagement = () => {
  const user = useContext(UserContext);

  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invitees, setInvitees] = useState<Invitee[]>([]);

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
      .get<Invitee[]>(`${BASE_URL}/invitations`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then((response) => setInvitees(response.data));
  }, []);

  const toMacroCase = (text: string) => text.toUpperCase().replace(/-/, "_");

  const isValidEmailAddress = (emailAddress: string) =>
    /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/.test(
      emailAddress
    );

  const inviteRegistrar = (
    name: string,
    backendTitle: string,
    emailAddress: string
  ) => {
    axios
      .post(
        `${BASE_URL}/invitations/for-${backendTitle}`,
        { name, emailAddress },
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
          ...invitees.filter((invitee) => invitee.name !== name),
          {
            id: response.data.code,
            name,
            role: toMacroCase(backendTitle),
            hasExpired: false,
            emailAddress,
          },
        ]);
      })
      .catch(() => alert("Deze gebruiker bestaat al!"));
  };

  const invite = (dutchTitle: string, backendTitle: string) => {
    const name = prompt(
      `Geef de naam van de ${dutchTitle} om uit te nodigen:`
    )?.trim();
    if (!name) {
      alert("Geen naam opgegeven!");
      return;
    }
    const validName = /^[\p{Alphabetic} -]+$/gu;
    if (!validName.test(name)) {
      alert(`Naam '${name}' bevat ongeldige leestekens.`);
      return;
    }
    const emailAddress = prompt(`Geef het e-mailadres van ${name}:`)?.trim();
    if (!emailAddress) {
      alert("Geen e-mailadres opgegeven!");
      return;
    }
    if (!isValidEmailAddress(emailAddress)) {
      alert(`E-mailadres '${emailAddress}' ongeldig!`);
      return;
    }
    inviteRegistrar(name, backendTitle, emailAddress);
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
    registrars.filter((registrar) => registrar.role === role).sort(byName);

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

  const inviteesForDisplay = invitees
    .filter(
      (invitee) =>
        user.isSuperAdmin() ||
        user.isPureAdmin() ||
        invitee.role === Role.TEACHER ||
        invitee.role === Role.COACH
    )
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

  const withdrawInvitation = (name: string) => {
    axios
      .delete(`${BASE_URL}/invitations/${name}`, {
        auth: {
          username: user.username,
          password: user.password,
        },
      })
      .then(() => {
        setInvitees(invitees.filter((invitee) => invitee.name !== name));
      });
  };

  const changeRole = (id: string, newRole: string) => {
    const name = registrars.find((registrar) => registrar.id === id)!.name;
    const sure = confirm(
      `Weet u zeker dat u ${name} nu de rol ${roleNames[newRole]} wilt geven?`
    );
    if (!sure) return;
    axios
      .patch(
        `${BASE_URL}/personnel/${id}`,
        {
          role: newRole,
        },
        {
          auth: {
            username: user.username,
            password: user.password,
          },
        }
      )
      .then((response) => {
        const otherRegistars = registrars.filter(
          (registrar) => registrar.id !== id
        );
        setRegistrars([...otherRegistars, response.data]);
      });
  };

  const superAdminDisable =
    user.isSuperAdmin() || user.isPureAdmin() ? disableRegistrar : undefined;

  const toKebabCase = (text: string) => text.toLowerCase().replace(/_/, "-");

  const recreateInvitation = (name: string) => {
    const invitee = invitees.find((invitee) => invitee.name === name)!;
    inviteRegistrar(name, toKebabCase(invitee.role), invitee.emailAddress);
  };

  return (
    <>
      {user.role !== Role.PURE_ADMIN && <HomeButton />}
      <br />
      <button onClick={inviteTeacher}>Nodig docent uit</button>
      <button onClick={inviteCoach}>Nodig studentbegeleider uit</button>
      {(user.isSuperAdmin() || user.isPureAdmin()) && (
        <>
          <button onClick={inviteAdmin}>Nodig administrator uit</button>
          <button onClick={inviteSuperAdmin}>
            Nodig super-administrator uit
          </button>
        </>
      )}
      {user.isSuperAdmin() && (
        <button onClick={addExternalTeacher}>
          Voeg externe docent toe die zich nog niet hoeft te registreren
        </button>
      )}

      <RegistrarList
        title="Docenten (die aanwezigheid kunnen registreren)"
        registrars={registeringTeachers}
        disableRegistrar={disableRegistrar}
        changeRole={changeRole}
      />
      {user.isSuperAdmin() && (
        <>
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
                  disabled={!user.isSuperAdmin()}
                >
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <RegistrarList
        title="Studentbegeleiders"
        registrars={coaches}
        disableRegistrar={disableRegistrar}
        changeRole={changeRole}
      />
      <RegistrarList
        title="Administratoren"
        registrars={admins}
        disableRegistrar={superAdminDisable}
        changeRole={changeRole}
      />
      <RegistrarList
        title="Super-administratoren"
        registrars={superAdmins}
        disableRegistrar={superAdminDisable}
        changeRole={changeRole}
      />
      <h3>Uitgenodigden</h3>
      <ul>
        {inviteesForDisplay.map((invitee) => (
          <li key={invitee.name}>
            {invitee.name} ({invitee.role})
            {invitee.hasExpired && " - UITNODIGING VERLOPEN!"}
            <button onClick={() => withdrawInvitation(invitee.name)}>
              Uitnodiging intrekken
            </button>
            <button onClick={() => recreateInvitation(invitee.name)}>
              Opnieuw uitnodigingslink produceren (maakt oude link ongeldig)
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default WorkerManagement;
