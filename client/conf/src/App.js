//Importation de mes composants
import React from "react";
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import Login from "./pages/Login"
import Home from "./pages/Home"
import Conference from './pages/Conference'

//Création du router en react
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" ><Home /></Route>
        <Route path="/login"><Login /></Route>
        <Route path="/conference"><Conference /></Route>
      </Switch>
    </Router>
  );
}

export default App;