import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminView from "./admin-view/AdminView.tsx";

import "./index.css";
import UserContext from "./context/UserContext.ts";
import LoginData from "./context/LoginData.ts";
import Login from "./components/Login.tsx";
import CoachView from "./components/CoachView.tsx";
import ScheduleView from "./schedule-view/ScheduleView.tsx";
import TeacherView from "./components/TeacherView.tsx";
import HistoryView from "./HistoryView.tsx";
import Role from "./components/shared/Role.ts";
import Authorized from "./components/shared/Authorized.tsx";
import PersonnelView from "./components/PersonnelView.tsx";
import RegistrationView from "./components/RegistrationView.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContext.Provider value={new LoginData()}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route
            path="/admin-view"
            element={
              <Authorized roles={[Role.ADMIN]}>
                <AdminView />
              </Authorized>
            }
          />
          <Route
            path="/coach-view"
            element={
              <Authorized roles={[Role.ADMIN]}>
                <CoachView />
              </Authorized>
            }
          />
          <Route
            path="/personnel-view"
            element={
              <Authorized roles={[Role.ADMIN]}>
                <PersonnelView />
              </Authorized>
            }
          />
          <Route
            path="/schedule-view"
            element={
              <Authorized roles={[Role.ADMIN]}>
                <ScheduleView />
              </Authorized>
            }
          />
          <Route
            path="/teacher-view"
            element={
              <Authorized roles={[Role.TEACHER]}>
                <TeacherView />
              </Authorized>
            }
          />
          <Route
            path="/students/:name"
            element={
              <Authorized roles={[Role.ADMIN]}>
                <HistoryView />
              </Authorized>
            }
          />
          <Route
            path="/registration-view/:invitationId"
            element={<RegistrationView />}
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  </React.StrictMode>
);
