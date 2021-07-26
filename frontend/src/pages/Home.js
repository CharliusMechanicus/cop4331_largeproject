import React, { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Offcanvas, Button, OffcanvasBody, OffcanvasHeader, ListGroup} from 'react-bootstrap';

const options = [  
    {
      // name: 'Enable backdrop (default)',
      scroll: false,
      backdrop: true,
    },
  ];

function ShowSettings({...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const api_path = 'https://kindling-lp.herokuapp.com/';
    var update_name, update_phonenumber, update_description;
    var token = JSON.parse(localStorage.getItem('user_data'));
    const [message, setMessage] = useState('');

    const doLogout = async event => 
    {
        window.location.href = '/';
    }

    const doUpdate = async event => 
    {
        var fields = {};

        if (update_name.value != '')
            fields['display_name_str'] = update_name.value;        

        if (update_phonenumber.value != '')
            fields['phone_str'] = update_phonenumber.value;

        if (update_description.value != '')
            fields['description_str'] = update_description.value;
        
        var obj = {email_str:token.email,update_fields_obj:fields,access_token_str:token.jwtToken};
        
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(api_path + 'api/update_profile',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            
            if (res.success_bool == true)
            {

                setMessage('Successfully update.');
                token.jwtToken = res.refreshed_token_str;

                localStorage.setItem('user_data', JSON.stringify(token));
                window.location.href = '/Home';
            }
            else
            setMessage('Fail to update.');            
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    }

    return (
        <>
        <Button variant="dark" onClick={toggleShow} className="settings-btn">
            <img className="person-icon" src="./person.png"></img>
        </Button>

        <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <Container fluid className="settings-block">
                    <Row className="settings-content">
                        <Row className="input-block">
                            <h3>Name</h3>
                            <input type="text" id="update_name" placeholder='displayname'></input>
                        </Row>
                        <Row className="input-block">
                            <h3>Phone Number</h3>
                            <input type="tel" id="update_phonenumber" placeholder='phonenumber'></input>
                        </Row>
                        <Row className="input-block">
                            <h3>Description</h3>
                            <input type="text" id="update_description" placeholder='description'></input>
                        </Row>
                    </Row>

                    <Row className="btn-group">
                        <Row>
                            <button className='logout-btn' id='logout_bnt' onClick={doLogout}>Log Out</button>
                        </Row>
                        <Row>
                            <button className='update-btn' id='update_bnt' onClick={doUpdate}>Update</button>
                        </Row>
                    </Row>
                </Container>

                {/* Backup */}
                {/* <div className="settings-block">
                    <h3>Name</h3>
                    <input type="text" id="update_name" placeholder='displayname'></input>
                    <h3>Phone Number</h3>
                    <input type="tel" id="update_phonenumber" placeholder='phonenumber'></input>
                    <h3>Description</h3>
                    <input type="text" id="update_description" placeholder='description'></input>
                    <div className="btn-group">
                        <button className='logout-btn' id='logout_bnt'>Log Out</button>
                        <button className='update-btn' id='update_bnt'>Update</button>
                    </div>
                </div> */}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
}

function ShowMatchList({...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    var user_data = localStorage.getItem('user_data');
    var token = JSON.parse(user_data);
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [match_list, setList] = useState(null);
    var obj = {email_str:token.email,output_select_str:'e',access_token_str:token.jwtToken};
    var js = JSON.stringify(obj);

    useEffect(() => 
    {
        fetch(api_path + 'api/get_matches',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then(res => {
            return res.json();
        })
        .then(res => {
            var user = {email:token.email, is_group:token.is_group ,jwtToken:res.refreshed_token_str};
            var user_data = JSON.stringify(user);
            localStorage.setItem('user_data', user_data);

            setList(res.matches_array);
        });
    },[]);

    return (
        <>
        <Button variant="dark" onClick={toggleShow} className="settings-btn">
            <img className="menu-icon" src="./menu.png"></img>
        </Button>

        <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Matches</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container className="matchlist-block">
                    <ListGroup>
                        <span className="matches-block"></span>
                    </ListGroup>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
}

function Home()
{
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [target,setTarget] = useState('');
    const [person,setPerson] = useState(null);
    const [message, setMessage] = useState('');

    // get token and form the json request.
    var token = JSON.parse(localStorage.getItem('user_data'));
    var obj = {email_str:token.email,is_group_bool:token.is_group,access_token_str:token.jwtToken};
    var js = JSON.stringify(obj);

    useEffect(()=>{
        // get the response from the server.
        fetch(api_path + 'api/get_candidate',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then( res => {
            return res.json();
        })
        .then( res => {
            var user = {email:token.email,is_group:token.is_group,jwtToken:res.refreshed_token_str};
            localStorage.setItem('user_data',JSON.stringify(user));
            setTarget(res.email_str);
        });
    },[]);

    useEffect(() => {
        token = JSON.parse(localStorage.getItem('user_data'));
        obj = {email_str:target,is_group_bool:token.is_group,access_token_str:token.jwtToken};
        js = JSON.stringify(obj);
        var path;

        // get individua profile if you're group.
        if (token.is_group)
            path = 'api/get_profile_individual';
        else
            path = 'api/get_profile_group';

        fetch((api_path + path) ,{method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then(res =>{
            return res.json();
        })
        .then(res=> {
            // update the token.
            var user = {email:token.email, is_group:token.is_group ,jwtToken:res.refreshed_token_str};
            localStorage.setItem('user_data',  JSON.stringify(user));
            // return the person object.
            setPerson({name:res.display_name_str,email:target,phone:res.phone_str,description:res.description_str});
        });
    },[target]);

    const swipe_left = () => 
    {
        token = JSON.parse(localStorage.getItem('user_data'));
        obj = {email_str:token.email,is_group_bool:token.is_group,target_email_str:target,access_token_str:token.jwtToken};
        js = JSON.stringify(obj);
        fetch(api_path + 'api/swipe_left',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then( res => {
            return res.json();
        })
        .then( res => {

            if (res.success_bool === false)  return;
            var user = {email:token.email,is_group:token.is_group,jwtToken:res.refreshed_token_str};
            localStorage.setItem('user_data',JSON.stringify(user));
            get_candidate();
        });
    }

    const swipe_right = () => 
    {
        token = JSON.parse(localStorage.getItem('user_data'));
        obj = {email_str:token.email,is_group_bool:token.is_group,target_email_str:target,access_token_str:token.jwtToken};
        js = JSON.stringify(obj);

        fetch(api_path + 'api/swipe_right',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then( res => {
            return res.json();
        })
        .then( res => {
            if (!res.success_bool)  return;

            if (res.match_bool)
                setMessage("You get a new match!");

            var user = {email:token.email,is_group:token.is_group,jwtToken:res.refreshed_token_str};
            localStorage.setItem('user_data',JSON.stringify(user));
            get_candidate();
        });
    }

    const get_candidate = () => 
    {
        token = JSON.parse(localStorage.getItem('user_data'));
        obj = {email_str:token.email,is_group_bool:token.is_group,access_token_str:token.jwtToken};
        js = JSON.stringify(obj);
    
        // get the response from the server.
        fetch(api_path + 'api/get_candidate',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then( res => {
            return res.json();
        })
        .then( res => {

            var user = {email:token.email,is_group:token.is_group,jwtToken:res.refreshed_token_str};
            localStorage.setItem('user_data',JSON.stringify(user));
            setTarget(res.email_str);
        });
    }

    const onSwipe = (direction) => {
        // go left.
        if (direction != 'right')
            swipe_left();
        // go right.
        else
            swipe_right();
    }

    return (
        <Container fluid className="content">
            <Row className="home-header">
                <Col className="setiings-header">
                    {options.map((props, idx) => (
                        <ShowSettings key={idx} {...props} />
                    ))}
                </Col>
                <Col className="header-logo">
                    <img className="fire-icon" src='/kindling-icon.png'></img>
                </Col>
                <Col className="matchlist-btn">
                    {options.map((props, idx) => (
                        <ShowMatchList key={idx} placement={'end'} {...props} />
                    ))}
                </Col>
            </Row>
            <Row className="center-piece">
                {person && <div className="card">
                    <h1>{person.name}</h1>
                    <h2>{person.phone}</h2>
                    <h2>{person.email}</h2>
                    <span>{person.description}</span>
                </div>}
            </Row>
            <Row className="footer-buttons">
                <h1>{message}</h1>

                <Col sm={8} className="accept-reject">
                    <img className="reject-icon" src="./close.png" onClick={swipe_left}></img>

                    <img className="accept-icon" src="./heart.png" onClick={swipe_right}></img>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;

{/* <button className='swipe_left' onClick={swipe_left} >No</button>
<button className='swipe_right' onClick={swipe_right}>Yes</button> */}