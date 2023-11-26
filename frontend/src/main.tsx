import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import Students from './Students'

import './index.css'
import Dates from './Dates.tsx'
import TeacherView from './TeacherView.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/students" element={<Students />} />
        <Route path="/dates" element={<Dates />} />
        <Route path="/teachers" element={<TeacherView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
