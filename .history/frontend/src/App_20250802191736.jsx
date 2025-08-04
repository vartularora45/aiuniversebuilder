import React from 'react'
{ BrowserRouter as Router, Route, Switch } from 'react-router-dom'
const App = () => {
  return (
   <Router>
     <Switch>
       <Route path="/" exact>
         <h1>Home Page</h1>
       </Route>
       <Route path="/about">
         <h1>About Page</h1>
       </Route>
     </Switch>
   </Router>
  )
}

export default App
