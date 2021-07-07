// THIS IS THE ENTRY POINT TO OUR APP
// THE ONLY THING THAT SHOULD OCCUR HERE IS DIRECTING PEOPLE TO THE CORRECT PAGE OR RESOURCE

/***********
|  IMPORTS |
************/
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import MainPage from './Pages/MainPage'
import SignUp from './Pages/SignUp'
import LogIn from './Pages/LogIn'
import ResetPassword from './Pages/ResetPassword';
import Cards from './Pages/Card';
import MatchList from './Pages/Match';
import Update from './Pages/Update';

/***********************************************************************************************************/
  
function App() {
  /* NOTICE THE <Switch> TAGS. THEY ACT LIKE SWITCH STATEMENTS IN C, BUT YOU DON'T HAVE TO 'break'
      AFTER A MATCHING 'case'. <Route> TAGS ARE LIKE THE CASES. <Redirect> ACTS LIKE THE 'default' CASE */
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

      <Route path="/card/update" exact>
        <Update />
      </Route>

      <Redirect to="/" />
    </Switch>  
  </Router>
  );
}

/***********************************************************************************************************/

export default App;