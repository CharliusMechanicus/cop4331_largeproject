import React from 'react';
import Switch from '@material-ui/core/Switch';

function SignUp()
{
    return(
        <div id='signup_wrraper'>
            <div id='signup1_container'>
                <span>What are you looking for?</span><br/>
                <span>Project</span>
                <Switch
                    // checked={state.checkedA}
                    // onChange={handleChange}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span>Individual</span><br/>
                <spna>Add some describetion</spna><br/>
                <input type="text" id="description" placeholder='description'></input><br/>
            </div>

            <div id='signup2_container'>
                <span>Basic Information</span><br/>
                <input type="text" id="displayname" placeholder='displayname'></input><br/>
                <input type="tel" id="phonenumber" placeholder='phonenumber'></input><br/>
                <input type="email" id="email" placeholder='email'></input><br/>
                <input type="password" id="password" placeholder='password'></input><br/>
                <input type="password" id="confirm_password" placeholder='confirm password'></input><br/>
                <button class='bnt' id='signup_bnt'>Sign Up</button><br/>
            </div>
        </div>
    );
}

export default SignUp;