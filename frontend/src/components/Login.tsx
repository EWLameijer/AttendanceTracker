import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const loginContext = useContext(UserContext);
  const navigate = useNavigate();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // axios.post("http://localhost:8080/users/login", {}, {
    //     auth: {
    //       username: loginData.username,
    //       password: loginData.password
    //     }
    //   });
    loginContext.update(loginData.username, loginData.password);
    navigate(`/teacher-view`);
  };

  const changeItem = (event: React.FormEvent<HTMLInputElement>) =>
    setLoginData({
      ...loginData,
      [event.currentTarget.id]: event.currentTarget.value,
    });

  return (
    <form onSubmit={submit}>
      <label htmlFor="username">Gebruikersnaam:</label>
      <input
        id="username"
        type="text"
        value={loginData.username}
        onChange={changeItem}
      />
      <br></br>
      <label htmlFor="password">Wachtwoord:</label>
      <input
        type="text"
        id="password"
        value={loginData.password}
        onChange={changeItem}
      />
      <br></br>
      <input type="submit" value="Inloggen" />
    </form>
  );
};

export default Login;
