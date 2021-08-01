import React, { useState, useEffect } from "react";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {Link} from "react-router-dom";

function ResetPassword()
{
    var email, code, newpassword, newpassword_confirm;
    const [message, setMessage] = useState('');
    const [showSendEmail, setShowSendEmail] = useState(true);
    const api_path = 'https://kindling-lp.herokuapp.com/';

    const doLogout = async event => 
    {
        window.location.href = '/';
    }

    const sendResetEmail = async event =>
    {
        event.preventDefault();

        var obj = {email_str:email.value};
        var js = JSON.stringify(obj);

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
                email.value = '';
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
                            <span>Confirm Email</span>
                        :
                            <span>Input code</span>
                        }
                        <span id="pw-warning">{message}</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {showSendEmail ?
                        <Row>
                            <Col className="modal-popular">
                                <input type='email' class='reset_input' ref={(c) => email = c} placeholder='email'></input>
                            </Col>
                        </Row>
                    :
                        <Row>
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

{/* <div id='reset_password_div'>
    { showSendEmail ?
    <form class='sendEmail'>
        <h1>Email Verification</h1>
        <input type='email' class='reset_input' ref={(c) => email = c} placeholder='email'></input>
        <h2>{message}</h2>
        <button class='btn' id='resetBtn' onClick={sendResetEmail}>Send Reset Email</button>
    </form>
    :
    <div class='reset_password'>
        <h1>Reset Password</h1><br/>
        <input type='text' className='verification_code' ref={(c) => code = c} placeholder='code'></input><br/>
        <input type="password" className="newpassword" id='newpassword' placeholder='new password' ref={(c) => newpassword = c}></input><br/>
        <input type="password" className="newpassword" id='newpassword_confirm' placeholder='confirm password' ref={(c) => newpassword_confirm = c}></input><br/>
        <span>{message}</span><br/><br/><br/>
        <button className='bnt' id='reset_password_bnt' onClick={verifyCode}>Reset Password</button><br/>
    </div>
    }
</div> */}

{/* <div className='email_verification'>
    <h1>Email Verification</h1>
    <input type='email' className='reset_input' ref={(c) => email = c} placeholder='email'></input><br/>
    <h2>{message}</h2><br/><br/><br/>
    <button className='btn' id='reset_email_verify_btn' onClick={sendResetEmail}>Send Rest Email</button>
</div> */}