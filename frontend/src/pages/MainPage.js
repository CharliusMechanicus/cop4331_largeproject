import React from 'react';

function MainPage()
{
  function toLogIn()
  {
    window.location.href='/Login';
  }

  function toSignUp()
  {
    window.location.href='/SignUp';
  }

  return (
      <div className="main-page" style={{backgroundImage: 'url("/background.png")'}}>
        <div>
          {/* Icon */}{/* span */}
          <img className='fire' id='small_icon' src='/kindling-icon.png'></img><br/>
          
          <h1 className='top_title'>Kindling</h1><br/>
          
          <div className='main_box'>
            {/* big icon */}
            <img class='fire_hand' id='small_icon' src='/fire-hand.png'></img><br/>
          
            {/* span */}
            <h1 className='center_text'>Kindle An Innovation</h1><br/>
          
            {/* buttom */} {/* buttom */}
            <button className='btn' id='signup_btn' onClick={toSignUp}>Sign Up</button>
            <button className='btn' id='login_btn' onClick={toLogIn}>Log In</button><br/>
          </div>
        </div>
      </div>
  );
}

export default MainPage;