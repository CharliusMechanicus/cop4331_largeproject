import React, { useState, useEffect } from "react";

function EmailVerification()
{
    var email,code;
    const [message,setMessage] = useState('');
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [showSend, setShowSend] = useState(true);

    const sendEmail = async event =>
    {
        var obj = {email_str:email.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/send_verification_email',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('* Unexpect error, please try again or register first.');
            }
            else
            {
                setShowSend(false);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    }

    const verifyCode = async event =>
    {
        var obj = {code_str:code.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/verify_email',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('* Uncorrect code!');
            }
            else
            {
                window.location.href = '/login';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    }

    return(
        <div class='email_verification'>
        {showSend ? 
            <div class='sendEmail'>
                <h1>Email Verification</h1>
                <input type='email' class='email_verify_input' ref={(c) => email = c} placeholder='email'></input><br/>
                <button class='btn' id='email_verify_btn' onClick={sendEmail}>Send Email</button>
                <h2>{message}</h2>
            </div>
            :
            <div class='code_verification'>
                <h1>Code Verification</h1>
                <input type='text' class='verification_code' ref={(c) => code = c} placeholder='code'></input><br/>
                <button class='btn' id='code_verify_btn' onClick={verifyCode}>Verify Code</button>
                <h2>{message}</h2>
            </div>
        }
        </div>
    );
}

export default EmailVerification;