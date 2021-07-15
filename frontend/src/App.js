import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import MainPage from './pages/MainPage'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import ResetPassword from './pages/ResetPassword';
import Cards from './pages/Card';
import MatchList from './pages/Match';
import Update from './pages/Update';
import EmailVerification from './pages/EmailVerification';
import InitialProfile from './pages/InitialProfile';

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

      <Route path="/signup/initial_profile" exact>
        <InitialProfile />
      </Route>

      <Route path="/login" exact>
        <LogIn />
      </Route>

      <Route path="/email_verification" exact>
        <EmailVerification />
      </Route>

      <Route path="/reset_password" exact>
        <ResetPassword />
      </Route>

      <Route path="/card" exact>
        <Cards />
      </Route>

      <Route path="/card/match" exact>
        <MatchList />
      </Route>

      <Route path="/card/update" exact>
        <Update />
      </Route>

      <Redirect to="/" />
    </Switch>  
  </Router>
  );
}

export default App;
