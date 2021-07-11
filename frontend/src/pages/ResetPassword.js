import React from 'react';

function ResetPassword()
{
    return (
        <div id='reset_password_wrrper'>
            <div id='send code'>
                <h1>Reset Password</h1><br/>
                <input type="email" name="username" placeholder='username or email'></input><br/>
                <button class='bnt' id='reset_password_bnt'>Send Reset Link</button><br/>
            </div>

            <div id='reset_div'>
                <h1>Reset Password</h1><br/>
                <input type="password" class="newpassword" id='newpassword' placeholder='new password'></input><br/>
                <input type="password" class="newpassword" id='newpassword_copy' placeholder='confirm password'></input><br/>
                <button class='bnt' id='reset_password_bnt'>Reset Password</button><br/>
            </div>
        </div>
    );
}

export default ResetPassword;