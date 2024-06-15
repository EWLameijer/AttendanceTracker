import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminView from "./group-management-page/AdminView.tsx";

import "./index.css";
import UserContext from "./login-page/UserContext.ts";
import LoginData from "./login-page/LoginData.ts";
import Login from "./login-page/Login.tsx";
import CoachView from "./attendance-management-page/CoachView.tsx";
import ScheduleView from "./class-management-page/ScheduleView.tsx";
import TeacherView from "./attendance-management-page/TeacherView.tsx";
import HistoryView from "./history-page/HistoryView.tsx";
import Role from "./login-page/Role.ts";
import Authorized from "./login-page/Authorized.tsx";
import PersonnelView from "./worker-management-page/PersonnelView.tsx";
import RegistrationView from "./worker-management-page/RegistrationView.tsx";

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
