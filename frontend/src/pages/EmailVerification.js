import React, { useState, useEffect } from "react";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import '../App.css';

function EmailVerification()
{
    var email,code;
    const [message,setMessage] = useState('');
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
                setMessage('* Unexpect error, please try again or register first.');
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
                                <input type='email' className='email_verify_input' ref={(c) => email = c} placeholder='email'></input>
                            </Col>
                        </Row>
                    :
                        <Row>
                            <Col className="modal-popular">
                                <input type='text' className='verification_code' ref={(c) => code = c} placeholder='code'></input>
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

{/* <div className='email_verification'>
{showSend ? 
    <div className='sendEmail'>
        <h1>Email Verification</h1>
        <input type='email' className='email_verify_input' ref={(c) => email = c} placeholder='email'></input><br/>
        <button className='btn' id='email_verify_btn' onClick={sendEmail}>Send Email</button>
        <h2>{message}</h2>
    </div>
    :
    <div className='codeVerification'>
        <h1>Code Verification</h1>
        <input type='text' className='verification_code' ref={(c) => code = c} placeholder='code'></input><br/>
        <button className='btn' id='code_verify_btn' onClick={verifyCode}>Verify Code</button>
        <h2>{message}</h2>
    </div>
}
</div> */}