import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import './LogIn&SignUp.css';

function LogIn()
{
    var loginName;
    var loginPassword;
    const login_api = 'https://kindling-lp.herokuapp.com/';
    const [message,setMessage] = useState('');

    const doLogin = async event =>
    {
        event.preventDefault();

        var obj = {email_str:loginName.value,password_str:loginPassword.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(login_api + 'api/login',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                // var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                // localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/card';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    };

    return (
        <div id='container'>
            <div class='bar'>
                <h1>Log In</h1><br/>
                <input type="email" name="username" placeholder='email\username' ref={(c) => loginName = c}></input><br/>
                <input type="password" name="password" placeholder='password' ref={(c) => loginPassword = c}></input><br/>
                <button class='btn' id='login_page_bnt' onClick={doLogin}>Log In</button><br/>
                <Link to={'/resetPassword'} >forget passwrod?</Link><br/>
                <h2 id="loginResult">{message}</h2>
            </div>
        </div>
    );
}

export default LogIn;
