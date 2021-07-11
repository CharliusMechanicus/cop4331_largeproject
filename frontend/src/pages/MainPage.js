import React, { useState, useEffect } from "react";
import './MainPage.css';

function MainPage()
{
  function toLogIn()
  {
    window.location.href='/login';
  }

  function toSignUp()
  {
    window.location.href='/signup';
  }

  return (
    <div className="App">
      {/* Icon */}{/* span */}
      <img class='fire' id='small_icon' src='https://cdn.discordapp.com/attachments/722279740248948759/862016029646389318/unknown.png'></img><br/>
      <h1 className='top_title'>Kindling</h1><br/>
      
      {/* big icon */}
      <img class='fire_hand' id='small_icon' src='https://media.discordapp.net/attachments/856542176195510302/860972438376022026/Group_168.png'></img><br/>
      
      {/* span */}
      <h1 className='center_text'>Kindle An Innovation</h1><br/>
      
      {/* buttom */} {/* buttom */}
      <button className='btn' id='signup_btn' onClick={toSignUp}>Sign Up</button>
      <button className='btn' id='login_btn' onClick={toLogIn}>Log In</button><br/>
    </div>
  );
}

export default MainPage;