import React from 'react';

export default function Settings()
{
    return (
        <div className='settings'>
            <div className='settings-block'>
                <h1>Edit Settings</h1><br/>
                <h3>Name</h3><br/>
                <input type="text" id="update_name" placeholder='displayname'></input><br/>
                <h3>Phone Number</h3><br/>
                <input type="tel" id="update_phonenumber" placeholder='phonenumber'></input><br/>
                <h3>Description</h3><br/>
                <input type="text" id="update_description" placeholder='description'></input><br/>
                <button className='update-btn' id='update_bnt'>Update</button><br/>
                <button className='logout-btn' id='logout_bnt'>Log Out</button><br/>
            </div>
        </div>
    );
}