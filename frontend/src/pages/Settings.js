import React, { useState } from 'react';

export default function Settings()
{
    const api_path = 'https://kindling-lp.herokuapp.com/';
    var update_name, update_phonenumber, update_description;
    var token = JSON.parse(localStorage.getItem('user_data'));
    const [message, setMessage] = useState('');

    const doLogout = async event => 
    {
        window.location.href = '/';
    }

    const doUpdate = async event => 
    {
        var fields = {};
        if (update_name.value != '')
            fields['display_name_str'] = update_name.value;
        if (update_phonenumber.value != '')
            fields['phone_str'] = update_phonenumber.value;
        if (update_description.value != '')
            fields['description_str'] = update_description.value;
        var obj = {email_str:token.email,update_fields_obj:fields,access_token_str:token.jwtToken};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/update_profile',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if (res.success_bool == true)
            {

                setMessage('Successfully update.');
                token.jwtToken = res.refreshed_token_str;

                localStorage.setItem('user_data', JSON.stringify(token));
                window.location.href = '/Home';
            }
            else
            setMessage('Fail to update.');            
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    }


    return (
        <div class='update_div'>
            <h1>Edit Settings</h1><br/>
            <span>Name</span><br/>
            <input type="text" id="update_name" placeholder='displayname' ref={(c) => update_name = c}></input><br/>
            <span>Phone Number</span><br/>
            <input type="tel" id="update_phonenumber" placeholder='phonenumber'ref={(c) => update_phonenumber = c}></input><br/>
            <span>Description</span><br/>
            <input type="text" id="update_description" placeholder='description' ref={(c) => update_description = c}></input><br/>
            <span>{message}</span>
            <button className='bnt' id='update_bnt' onClick={doUpdate}>Update</button><br/>
            <button className='bnt' id='logout_bnt' onClick={doLogout}>Log Out</button><br/>
        </div>
    );
}