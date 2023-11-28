import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminView from './admin-view/AdminView.tsx'

import './index.css'
import CoachView from './coach-view/CoachView.tsx'
import TeacherView from './TeacherView.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin-view" element={<AdminView />} />
        <Route path="/coach-view" element={<CoachView />} />
        <Route path="/teacher-view" element={<TeacherView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
