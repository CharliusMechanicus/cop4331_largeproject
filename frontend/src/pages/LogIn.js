import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";


function LogIn()
{
    function login_function()
    {
        window.location.href='/card';
    }

    return (
        <div id='login_container'>
            <span>Log In</span><br/>
            <input type="email" name="username"></input><br/>
            <input type="password" name="password"></input><br/>
            <button class='bnt' id='login_bnt' onClick={login_function}>Log In</button><br/>
            <Link to={'/resetPassword'} >forget passwrod?</Link><br/>
        </div>
    );
}

export default LogIn;