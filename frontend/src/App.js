import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import MainPage from './Pages/MainPage'
import SignUp from './Pages/SignUp'
import LogIn from './Pages/LogIn'
import ResetPassword from './Pages/ResetPassword';
import Cards from './Pages/Card';
import MatchList from './Pages/Match';

function App() {

  return (
  <Router >
    <Switch>
      
      <Route path="/" exact>
        <MainPage />
      </Route>

      <Route path="/signup" exact>
        <SignUp />
      </Route>

      <Route path="/login" exact>
        <LogIn />
      </Route>

      <Route path="/resetpassword" exact>
        <ResetPassword />
      </Route>

      <Route path="/card" exact>
        <Cards />
      </Route>

      <Route path="/card/match" exact>
        <MatchList />
      </Route>

      <Redirect to="/" />
    </Switch>  
  </Router>
  );
}

export default App;
