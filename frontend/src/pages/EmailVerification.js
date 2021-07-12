import React, { useState, useEffect } from "react";

function EmailVerification()
{
    var email;
    const [message,setMessage] = useState('');

    const sendEmail = async event =>
    {

    }

    return(
        <div class='email_verification'>
            <h1>Email Verification</h1>
            <input type='email' class='email_verify_input' ref={(c) => email = c} placeholder='email'></input>
            <button class='btn' id='email_verify_btn' onClick={sendEmail}>Send Email</button>
            <h2>{message}</h2>
        </div>
    );
}

export default EmailVerification;