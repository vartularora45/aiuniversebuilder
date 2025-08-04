import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import SignupAndLoginPage from '../src/pages/SignupAndLoginPage.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup-login" element={<SignupAndLoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
