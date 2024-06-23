import { useContext } from "react";
import { Registrar } from "../-shared/utils";
import UserContext from "../-shared/UserContext";
import Role from "../-shared/Role";
import roleNames from "./roleNames";

const RegistrarList = (props: {
  title: string;
  registrars: Registrar[];
  disableRegistrar?: (id: string) => void;
  changeRole: (id: string, newRole: string) => void;
}) => {
  const user = useContext(UserContext);

  return (
    <>
      <h3>{props.title}</h3>
      <ul>
        {props.registrars.map((registrar) => (
          <li key={registrar.id}>
            {registrar.name}
            <button
              onClick={() => props.disableRegistrar?.(registrar.id)}
              disabled={
                !props.disableRegistrar || user.username === registrar.name
              }
            >
              Account deactiveren
            </button>
            {user.isSuperAdmin() &&
              registrar.role !== Role.TEACHER &&
              user.username !== registrar.name && (
                <>
                  {[Role.COACH, Role.ADMIN, Role.SUPER_ADMIN]
                    .filter((role) => registrar.role !== role)
                    .map((role) => (
                      <button
                        key={role}
                        onClick={() => props.changeRole(registrar.id, role)}
                      >
                        Maak {roleNames[role]}
                      </button>
                    ))}
                </>
              )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default RegistrarList;
