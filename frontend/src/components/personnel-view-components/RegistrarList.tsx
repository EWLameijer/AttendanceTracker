import { useContext } from "react";
import { Registrar } from "../../utils";
import UserContext from "../../context/UserContext";

const RegistrarList = (props: {
  title: string;
  registrars: Registrar[];
  disableRegistrar: (id: string) => void;
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
              onClick={() => props.disableRegistrar(registrar.id)}
              disabled={user.username == registrar.name}
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
