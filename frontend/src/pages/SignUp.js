import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';

function SignUp()
{
    const [switchshow, setSwitchshow] = useState('Project');
    

    const toIndividual = async event =>
    {
        setSwitchshow("Individual");
    }

    return(
        <div id='signup_wrraper'>
            <div id='signup1_container'>
                <h1>What are you looking for?</h1><br/>
                <h2>{switchshow}</h2>
                <Switch
                    // checked={state.checkedA}
                    onChange={toIndividual}
                    name="swtich_btn"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                /><br/>
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