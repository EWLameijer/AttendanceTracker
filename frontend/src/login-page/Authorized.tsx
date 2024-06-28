import { FC, useContext } from "react";
import UserContext from "../-shared/UserContext";
import { Navigate } from "react-router";

// from https://blog.logrocket.com/authentication-react-router-v6/ , extended with authorization

const Authorized: FC<{
  roles: string[];
  children: React.ReactElement;
}> = ({ roles, children }) => {
  const user = useContext(UserContext);
  if (roles.includes(user.role)) {
    return children;
  }
  return <Navigate to="/" />;
};

export default Authorized;
