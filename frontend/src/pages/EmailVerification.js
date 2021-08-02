import React, { useState, useEffect } from "react";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {Link} from "react-router-dom";

function EmailVerification()
{
    var email,code;
    const [message, setMessage] = useState('');
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [showSend, setShowSend] = useState(true);

    const doLogout = async event => 
    {
        window.location.href = '/';
    }

    const sendEmail = async event =>
    {
        var obj = {email_str:email.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/send_verification_email',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('*Unexpect error, please try again or register first.');
            }
            else
            {
                email.value = '';
                setShowSend(false);
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
        var obj = {code_str:code.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/verify_email',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if( res['success_bool'] == false )
            {
                setMessage('* Uncorrect code!');
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

    return(
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
                        {showSend ?
                            <span>Confirm Email</span>
                        :
                            <span>Input code</span>
                        }
                        <span id="pw-warning">{message}</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {showSend ?
                        <Row>
                            <Col className="modal-popular">
                                <input type='email' className='email_verify_input' ref={(c) => email = c} placeholder='Email'></input>
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
                                <span className="check-this"></span>
                                <h5>Please input the code below</h5>
                            </Col>
                            <Col className="modal-popular">
                                <input type='text' className='verification_code' ref={(c) => code = c} placeholder='Code'></input>
                            </Col>
                        </Row>
                    }
                </Modal.Body>

                <Modal.Footer className="initial-footer">
                    <button className='logout-btn-footer' onClick={doLogout}>Logout</button>

                    {showSend ?
                        <button className="continue-btn" id='email_verify_btn' onClick={sendEmail}>Continue</button>
                    :
                        <button className="continue-btn" id='code_verify_btn' onClick={verifyCode}>Continue</button>
                    }
                </Modal.Footer>
                
                </Modal>
        </Container>
    );
}

export default EmailVerification;