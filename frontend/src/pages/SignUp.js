import React, { useState } from 'react';
import Switch from 'react-switch';

function SignUp()
{
    var displayname, phonenumber, email, password, confirm_password;
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [message,setMessage] = useState('');

    const [checked, setChecked] = useState(false);
    const toIndividual = nextChecked => {
        setChecked(nextChecked);
    }

    const doSignup = async event =>
    {
        //console.log(password.value + " || " + confirm_password.value);
        if (password.value !== confirm_password.value)
        {
            setMessage('* Passwords do not match!');
        }
        else
        {
            event.preventDefault();

            var obj = {email_str:email.value, password_str:password.value, dispaly_name_str:displayname.value,
                        phone_str:phonenumber.value,is_group_bool:checked};
            var js = JSON.stringify(obj);
            
            try
            {    
                const response = await fetch(api_path + 'api/register',
                    {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

                var res = JSON.parse(await response.text());
                
                if( res['success_bool'] === false )
                {
                    window.location.href = '/login';
                }
                else
                {
                    window.location.href = '/emailverification';
                }
            }
            catch(e)
            {
                alert(e.toString());
                return;
            } 
        }
    }

    return(
        <div id='signup1_container'>
            <h1>Basic Information</h1>
            <input type="text" id="singup_displayname" placeholder='displayname' ref={(c) => displayname = c}></input><br/>
            <input type="tel" id="singup_phonenumber" placeholder='phonenumber' ref={(c) => phonenumber = c}></input><br/>
            <input type="email" id="singup_email" placeholder='email' ref={(c) => email = c}></input><br/>
            <input type="password" id="signup_password" placeholder='password' ref={(c) => password = c}></input><br/>
            <input type="password" id="confirm_password" placeholder='confirm password' ref={(c) => confirm_password = c}></input><br/>
            <h1>What are you looking for?</h1>
            <h2>{checked ? 'Project' : 'Individual'}</h2>
            <Switch
                checked={checked}
                onChange={toIndividual}
                className='switch_btn'
            /><br/>
            <span>{message}</span>
            <button class='bnt' id='signup_bnt' onClick={doSignup}>Sign Up</button><br/>
        </div>
    );
}

export default SignUp;