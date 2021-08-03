import React, { useState, useEffect } from "react";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {Link} from "react-router-dom";

function ResetPassword()
{
    var email, code, newpassword, newpassword_confirm;
    const [message, setMessage] = useState('');
    const [showSendEmail, setShowSendEmail] = useState(true);
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [displayEmail, setEmail] = useState('');

    const doLogout = async event => 
    {
        window.location.href = '/';
    }

    const sendResetEmail = async event =>
    {
        event.preventDefault();

        var obj = {email_str:email.value};
        var js = JSON.stringify(obj);

        setEmail(email.value);

        try
        {    
            const response = await fetch(api_path + 'api/send_password_reset',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('*Unexpected error, please register first.');
            }
            else
            {
                email='';
                setMessage('');
                setShowSendEmail(false);
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    }


    const verifyCode = async event =>
    {
        if (newpassword.value !== newpassword_confirm.value)
        {
            setMessage('*Passwords do not match!');
        }
        else
        {
            var obj = {code_str:code.value,new_password_str:newpassword.value};
            var js = JSON.stringify(obj);

            try
            {    
                const response = await fetch(api_path + 'api/reset_password',
                    {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

                var res = JSON.parse(await response.text());

                if( res.success_bool == false )
                {
                    setMessage('*Incorrect code. Please try again!');
                }
                else
                {
                    window.location.href = '/';
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
        <Container fluid className='email_verification'>
            <Row className="main-header">
                <Col xs={1} className="main-fire-icon">
                <Link to={'/'} className="title-link">
                    <img className='fire' id='small_icon' src='/kindling-icon.png'></img>
                </Link>
                </Col>
                <Col xs={1} className="main-header-title">
                <Link to={'/'} className="title-link">
                    <h1 className='top_title'>Kindling</h1>
                </Link>
                </Col>
            </Row>
            <Modal
                centered
                show={true}
                aria-labelledby="contained-modal-title-vcenter"
                keyboard={false}
                backdrop="static"
                dialogClassName="modal-40w"
                >

                <Modal.Header>
                    <Modal.Title className="title-extra">
                        {showSendEmail ?
                            <span className="title-header">Input Email</span>
                        :
                            <span className="title-header">Input code</span>
                        }
                        <span id="pw-warning">{message}</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {showSendEmail ?
                        <Row>
                            <Col className="modal-popular">
                                <input type='email' className='reset_input' ref={(c) => email = c} placeholder='email'></input>
                            </Col>
                        </Row>
                    :
                        <Row className="airplane-input">
                            <Col className="check-email">
                                <h4>Please check your email</h4>
                            </Col>
                            <Col className="airplane">
                                <img className="airplane-img" src='/airplane.png'></img>
                            </Col>
                            <Col className="check-email">
                                <h5>A verification code has been sent to</h5>
                                <span className="check-this">{displayEmail}</span>
                                <h5 className="check-bottom">Please input the code below</h5>
                            </Col>
                            <Col className="modal-special">
                                <input type='text' className='verification_code' ref={(c) => code = c} placeholder='code'></input>

                                <input type="password" className="newpassword" id='newpassword' placeholder='new password' ref={(c) => newpassword = c}></input>

                                <input type="password" className="newpassword" id='newpassword_confirm' placeholder='confirm password' ref={(c) => newpassword_confirm = c}></input>
                            </Col>
                        </Row>
                    }
                </Modal.Body>

                <Modal.Footer className="initial-footer">
                    <button className='logout-btn-footer' onClick={doLogout}>Return</button>

                    {showSendEmail ?
                        <button className="continue-btn" id='resetBtn' onClick={sendResetEmail}>Send Reset Email</button>
                    :
                        <button className="continue-btn" onClick={verifyCode}>Continue</button>
                    }
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ResetPassword;