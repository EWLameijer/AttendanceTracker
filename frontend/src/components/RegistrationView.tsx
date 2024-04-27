import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils";
import axios from "axios";
import { useEffect, useState } from "react";

interface Invitation {
  name: string;
}

const RegistrationView = () => {
  const { invitationId } = useParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Invitation>(`${BASE_URL}/invitations/${invitationId}`)
      .then((result) => setName(result.data.name));
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password != repeatedPassword) {
      alert("Wachtwoorden zijn ongelijk");
      return;
    }
    const validationErrors = checkPassword(password);
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }
    axios
      .post(`${BASE_URL}/workers/register`, {
        invitationId,
        password,
      })
      .then(() => {
        alert(
          "Je bent geregistreerd! Log in met je gebruikersnaam en wachtwoord!"
        );
        navigate("/");
      });
  };

  return name ? (
    <>
      Hallo {name}, kies een wachtwoord (minimaal 16 tekens, moet hoofdletters,
      kleine letters, cijfers en minstens 1 leesteken bevatten.)
      <form onSubmit={submit}>
        <label htmlFor="password">Wachtwoord</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        ></input>
        <br />
        <label htmlFor="repeatedPassword">Wachtwoord (herhaald)</label>
        <input
          type="password"
          id="repeatedPassword"
          value={repeatedPassword}
          onChange={(event) => setRepeatedPassword(event.currentTarget.value)}
        ></input>
        <br />
        <button type="submit">Account aanmaken</button>
      </form>
    </>
  ) : (
    <h1>Ongeldige code!</h1>
  );
};

export default RegistrationView;

const checkPassword = (password: string) =>
  [
    [password.length < 16, "Het wachtwoord bevat minder dan 16 tekens."],
    [!/[A-Z]/.test(password), "Het wachtwoord moet een hoofdletter bevatten."],
    [
      !/[a-z]/.test(password),
      "Het wachtwoord moet een kleine letter bevatten.",
    ],
    [!/[0-9]/.test(password), "Het wachtwoord moet een cijfer bevatten."],
    [
      !password
        .split("")
        .some((c) => "`~!@#$%^&*()-_=+[{]};:'\"|,<.>/?".includes(c)),
      "Het wachtwoord moet een leesteken bevatten.",
    ],
  ]
    .filter(([isApplicable]) => isApplicable)
    .map((error) => error[1]);
