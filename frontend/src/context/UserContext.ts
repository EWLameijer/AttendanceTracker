// context.js
import { createContext } from "react";
import LoginData from "./LoginData";

const UserContext = createContext<LoginData>(new LoginData());

export default UserContext;
