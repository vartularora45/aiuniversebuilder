import React from 'react'
import { BrowserRouter as Router, Route, BrowserRouter } from 'react-router-dom'
import LandingPage from '../src/pages/LandingPage.jsx'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      
       <Route  path="/" Component={<LandingPage/>}  />
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
