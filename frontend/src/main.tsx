import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminView from "./admin-view/AdminView.tsx";

import "./index.css";
import UserContext from "./context/UserContext.ts";
import LoginData from "./context/LoginData.ts";
import Login from "./components/Login.tsx";
import CoachView from "./coach-view/CoachView.tsx";
import ScheduleView from "./schedule-view/ScheduleView.tsx";
import TeacherView from "./components/TeacherView.tsx";
import HistoryView from "./HistoryView.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContext.Provider value={new LoginData()}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="/admin-view" element={<AdminView />} />
          <Route path="/coach-view" element={<CoachView />} />
          <Route path="/schedule-view" element={<ScheduleView />} />
          <Route path="/teacher-view" element={<TeacherView />} />
          <Route path="/students/:name" element={<HistoryView />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  </React.StrictMode>
);
