import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminView from "./group-management-page/GroupManagement.tsx";

import "./index.css";
import UserContext from "./-shared/UserContext.ts";
import LoginData from "./-shared/LoginData.ts";
import Login from "./login-page/Login.tsx";
import ScheduleView from "./class-management-page/ScheduleView.tsx";
import HistoryView from "./history-page/HistoryView.tsx";
import Role from "./-shared/Role.ts";
import Authorized from "./login-page/Authorized.tsx";
import RegistrationView from "./registration-page/RegistrationView.tsx";
import AttendanceManagement from "./attendance-management-page/AttendanceManagement.tsx";
import WorkerManagement from "./worker-management-page/WorkerManagement.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContext.Provider value={new LoginData()}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route
            path="/group-management"
            element={
              <Authorized roles={[Role.SUPER_ADMIN]}>
                <AdminView />
              </Authorized>
            }
          />
          <Route
            path="/attendance-management"
            element={
              <Authorized
                roles={[Role.SUPER_ADMIN, Role.ADMIN, Role.COACH, Role.TEACHER]}
              >
                <AttendanceManagement />
              </Authorized>
            }
          />
          <Route
            path="/worker-management"
            element={
              <Authorized roles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                <WorkerManagement />
              </Authorized>
            }
          />
          <Route
            path="/class-management"
            element={
              <Authorized roles={[Role.SUPER_ADMIN]}>
                <ScheduleView />
              </Authorized>
            }
          />
          <Route
            path="/students/:name"
            element={
              <Authorized roles={[Role.SUPER_ADMIN, Role.ADMIN, Role.COACH]}>
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
