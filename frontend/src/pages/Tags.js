import React, { useState, useEffect } from "react";


export default function Tages()
{
    const[message, setMessage] = useState('');
    const[showTags, setShowTags] = useState(false);

    const setTages = async event =>
    {
        setShowTags(true);
    }

    return (
        <div class='continue_signup'>
            { showTags ? 
                <div id='signup2_container'>
                    <h1>Add some describetion</h1><br/>
                    <input type="text" id="description" placeholder='description'></input><br/>
                </div>
                :
                <div class='signup2_tags'>
                    <h1>Pick your interest</h1>
                    <button class='btn' onClick={setTages}>Next</button>
                </div>
            }
        </div>
    );
}