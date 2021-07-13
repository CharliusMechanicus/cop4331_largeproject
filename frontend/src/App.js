// THIS IS THE ENTRY POINT TO OUR APP
// THE ONLY THING THAT SHOULD OCCUR HERE IS DIRECTING PEOPLE TO THE CORRECT PAGE OR RESOURCE

/***********
|  IMPORTS |
************/
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

/***********
|  PAGES   |
************/
import MainPage from './pages/MainPage';
// import SignUp from './pages/SignUp';
// import Login from './pages/Login';
// import ResetPassword from './pages/ResetPassword';
// import Cards from './pages/Cards';
// import MatchList from './pages/MatchList';

/***********************************************************************************************************/

function App() {

  /* NOTICE THE <Switch> TAGS. THEY ACT LIKE SWITCH STATEMENTS IN C, BUT YOU DON'T HAVE TO 'break'
     AFTER A MATCHING 'case'. <Route> TAGS ARE LIKE THE CASES. <Redirect> ACTS LIKE THE 'default' CASE */

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {/* // INSERT HOME INDEX PAGE THAT YOU IMPORTED HERE */}
          <MainPage/>
        </Route>
{/* 
        <Route path="/SignUp" exact>
          <SignUp/>
        </Route>

        <Route path="/Login" exact>
          <Login/>
        </Route>

        <Route path="/ResetPassword" exact>
          <ResetPassword/>
        </Route>

        <Route path="/Cards" exact>
          <Cards/>
        </Route>

        <Route path="/MatchList" exact>
          <MatchList/>
        </Route> */}

        <Redirect to="/" />
      </Switch>  
    </Router>
  );

}

/***********************************************************************************************************/

export default App;