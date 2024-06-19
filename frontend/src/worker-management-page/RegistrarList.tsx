import { useContext } from "react";
import { Registrar } from "../-shared/utils";
import UserContext from "../-shared/UserContext";

const RegistrarList = (props: {
  title: string;
  registrars: Registrar[];
  disableRegistrar?: (id: string) => void;
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
          </li>
        ))}
      </ul>
    </>
  );
};

export default RegistrarList;
