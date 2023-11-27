import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Students from './Students'

import './index.css'
import CoachView from './CoachView.tsx'
import TeacherView from './TeacherView.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/students" element={<Students />} />
        <Route path="/coach-view" element={<CoachView />} />
        <Route path="/teacher-view" element={<TeacherView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
