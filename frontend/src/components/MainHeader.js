import React from 'react';
import '../App.css';

function MainHeader()
{
    return(
        <div className="main-header">
            <div className="main-left">
                <img src="/kindling-icon.png" alt="Kindling Icon" class="icon"/>
            </div>
            <div className="main-right">
                <h1 class="title">
                    Kindling
                </h1>
            </div>
        </div>
    );
};

export default MainHeader;