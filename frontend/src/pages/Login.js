import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import '../App.css';

function Login()
{
    var loginName;
    var loginPassword;
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [message,setMessage] = useState('');


    const doLogin = async event =>
    {
        event.preventDefault();

        var obj = {email_str:loginName.value,password_str:loginPassword.value};
        var js = JSON.stringify(obj);
        
        try
        {    
            const response = await fetch(api_path + 'api/login', {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            var user = {email:loginName.value, is_group:res.is_group_bool ,jwtToken:res.access_token_str};
            var user_data = JSON.stringify(user);
            
            // ready state is 0, send user to email verification page.
            if( res.ready_status_int == 0)
            {
                window.location.href = '/emailverification';
            }
            // ready state is 1, send user to complete his personal file.
            else if( res.ready_status_int == 1)
            {
                localStorage.setItem('user_data', user_data);

                setMessage('Got 1');
                
                window.location.href = '/InitializeProfile';
            }
            // successfully logged in
            else if ( res.ready_status_int == 2)
            {localStorage.setItem('user_data', user_data);

                setMessage('Got 2');
                window.location.href = '/Home';
            }
            // Failed to login
            else
            {
                setMessage('User/Password combination incorrect');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    };

    return (
        <div id="container">
            <img className='fire' id='small_icon' src='/kindling-icon.png'></img><br/>
          
            <h1 className='top_title'>Kindling</h1><br/>
            <div className="login-box">
                <h1>Log In</h1>
                <input type="email" name="username" placeholder='E-mail' ref={(c) => loginName = c}></input>
                <input type="password" name="password" placeholder='Password' ref={(c) => loginPassword = c}></input>
                <button className='btn2' id='login_page_bnt' onClick={doLogin}>Log In</button>
                <Link to={'/resetPassword'} style={{ textDecoration: 'none'}}>forgot password?</Link>
                <h2 id="loginResult">{message}</h2>
            </div>
        </div>
    );
}

export default Login;