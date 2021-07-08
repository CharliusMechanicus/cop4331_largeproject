import React from 'react';

export default function Update()
{
    return (
        <div class='update_div'>
            <h1>Edit Settings</h1><br/>
            <span>Name</span><br/>
            <input type="text" id="update_name" placeholder='displayname'></input><br/>
            <span>Phone Number</span><br/>
            <input type="tel" id="update_phonenumber" placeholder='phonenumber'></input><br/>
            <span>Description</span><br/>
            <input type="text" id="update_description" placeholder='description'></input><br/>
            <button class='bnt' id='update_bnt'>Update</button><br/>
            <button class='bnt' id='logout_bnt'>Log Out</button><br/>
        </div>
    );
}