import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Role from "./shared/Role";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const user = useContext(UserContext);
  const navigate = useNavigate();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .get("http://localhost:8080/login", {
        auth: {
          username: loginData.username,
          password: loginData.password,
        },
      })
      .then((response) => {
        const role = response.data.role;
        user.update(loginData.username, loginData.password, role);
        if (user.isTeacher()) navigate("/teacher-view");
        else navigate("/coach-view");
      })
      .catch(() => alert("Gebruikersnaam/wachtwoord-combinatie onbekend!"));
  };

  const changeItem = (event: React.FormEvent<HTMLInputElement>) =>
    setLoginData({
      ...loginData,
      [event.currentTarget.id]: event.currentTarget.value,
    });

  return (
    <form onSubmit={submit}>
      <label htmlFor="username">Gebruikersnaam:</label>
      <input id="username" value={loginData.username} onChange={changeItem} />
      <br></br>
      <label htmlFor="password">Wachtwoord:</label>
      <input
        id="password"
        type="password"
        value={loginData.password}
        onChange={changeItem}
      />
      <br></br>
      <input type="submit" value="Inloggen" />
    </form>
  );
};

export default Login;
