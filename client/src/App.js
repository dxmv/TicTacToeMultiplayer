import React, { useState } from 'react'
import Room from "./Components/Room";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import Game from './Components/Game';
export default function App() {
  const[username,setUsername]=useState("");
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/room/:id" render={(props)=><Game {...props} username={username}/>} />
          <Route exact path="/" render={(props)=><Room {...props} setUsername={setUsername}/>} />
        </Switch>
      </Router>
    </div>
  )
}
