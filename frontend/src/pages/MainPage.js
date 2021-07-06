import React from 'react';

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
      <img class='fire' id='small_icon' src='https://media.discordapp.net/attachments/860932549257330738/860942532820992060/flame.png'></img><br/>
      <span>Kindling</span><br/>
      
      {/* big icon */}
      <img class='fire_hand' id='small_icon' src='https://media.discordapp.net/attachments/856542176195510302/860972438376022026/Group_168.png'></img><br/>
      
      {/* span */}
      <span>Kindle An Innovation</span><br/>
      
      {/* buttom */} {/* buttom */}
      <button onClick={toSignUp}>Sign Up</button>
      <button onClick={toLogIn}>Log In</button><br/>
    </div>
  );
}

export default MainPage;