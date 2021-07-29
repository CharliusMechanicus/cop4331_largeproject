import React, { useState } from 'react';
import Switch from 'react-switch';
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';

function SignUpModal() {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const modalBreak = ['md-down'];

  const [value, setValue] = React.useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  var displayname, phonenumber, email, password, confirm_password;
  const api_path = 'https://kindling-lp.herokuapp.com/';
  const [message,setMessage] = useState('');

  const [checked, setChecked] = useState(false);
  const toIndividual = nextChecked => {
      setChecked(nextChecked);
  }

  const doSignUp = async event =>
  {
      if (password.value !== confirm_password.value)
      {
          setMessage('*Mismatched passwords!');
      }
      else
      {
          event.preventDefault();

          var obj = {email_str:email.value, password_str:password.value, display_name_str:displayname.value,
                      phone_str:phonenumber.value,is_group_bool:checked};
          var js = JSON.stringify(obj);
          
          try
          {    
              const response = await fetch(api_path + 'api/register',
                  {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

              var res = JSON.parse(await response.text());
              
              if( res['success_bool'] === false )
              {
                  window.location.href = '/Login';
              }
              else
              {
                  window.location.href = '/EmailVerification';
              }
          }
          catch(e)
          {
              alert(e.toString());
              return;
          } 
      }
  }

  return (
    <>
      {modalBreak.map((v, idx) => (
        <button key={idx} className="signup-modal-btn" onClick={() => handleShow(v)}>
          Sign Up
        </button>
      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Account<span id="pw-warning">{message}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="input-blanket">
              <Col className="signup-input-group">
                <input type="text" className="signup-input" id="singup_displayname" placeholder='Display Name' ref={(c) => displayname = c}></input>

                <input type="tel" className="signup-input" id="singup_phonenumber" placeholder='Phone Number' ref={(c) => phonenumber = c}></input>
                
                <input type="email" className="signup-input" id="singup_email" placeholder='Email Address' ref={(c) => email = c}></input>
                
                <input type="password" className="signup-input" id="signup_password" placeholder='Password' ref={(c) => password = c}></input>
                
                <input type="password" className="signup-input" id="confirm_password" placeholder='Confirm Password' ref={(c) => confirm_password = c}></input>
              </Col>
              <Col className="switch-group">
                <Row className="selection-body">
                  <Col>
                    <h4 id="desire">What are you looking for?</h4>
                  </Col>
                  <Col className="selection-component">
                    <Row>
                      <Col>
                        <p id="i-select">Members</p>
                      </Col>
                      <Col>
                        <Switch 
                          className="signup-switch"
                          id="user-selection"
                          onColor="#BF4342" 
                          offColor="#FFA347"
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onChange={toIndividual} 
                          checked={checked}
                        />
                      </Col>
                      <Col>
                        <p id="p-select">Project</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col className="signup-modal-footer">
                <button id='signup_btn_2' onClick={doSignUp}>Sign Up</button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

function MainPage()
{
  function toLogIn()
  {
    window.location.href='/Login';
  }

  return (
    <Container fluid>
      <Row className="main-header">
        <Col xs={1} className="main-fire-icon">
          <img className='fire' id='small_icon' src='/kindling-icon.png'></img>
        </Col>
        <Col xs={1} className="main-header-title">
          <h1 className='top_title'>Kindling</h1>
        </Col>
      </Row>
      <Row className="main-center">
        <Col sm={6} className="middle-content">
          <img class='fire_hand' id='small_icon' src='/fire-hand.png'></img>
  
          <h1 className='center_text'>Kindle An Innovation</h1>
        </Col>
      </Row>
      <Row className="main-footer">
        <Col sm={6} className="main-btn">
          <SignUpModal/>

          <button className='btn' id='login_btn' onClick={toLogIn}>Log In</button>
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;