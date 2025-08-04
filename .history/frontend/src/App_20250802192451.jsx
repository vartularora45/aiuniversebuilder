import React from 'react'
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from 'react-router-dom'
const App = () => {
  return (
    <BrowserRouter>
    <Router>
      <Route path="/" exact>
        <h1>Welcome to the Home Page</h1>
      </Route>
    </Router>
    </BrowserRouter>
  )
}

export default App
