import React, { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Offcanvas, Button, OffcanvasBody, OffcanvasHeader} from 'react-bootstrap';

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
                            <button className='logout-btn' id='logout_bnt'>Log Out</button>
                        </Row>
                        <Row>
                            <button className='update-btn' id='update_bnt'>Update</button>
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
    console.log(JSON.parse(localStorage.getItem('user_data')).jwtToken);

    const[peolpe, setPeople] = useState([
        {
            name: 'Jack',
            url: 'https://upload.wikimedia.org/wikipedia/en/c/cd/CreedBratton%28TheOffice%29.jpg'
        },
        {
            name: 'Sunny',
            url: 'https://smartcdn.prod.postmedia.digital/vancouversun/wp-content/uploads/2019/04/ali-skovbye-headshot-2.jpg'
        },
        {
            name: 'Jack',
            url: 'https://content.api.news/v3/images/bin/8509e5cc46911c38ec54a81227ccde37'
        },
    ]);

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
                <Col sm={8} className="card">
                    {peolpe.map(person => (
                        <TinderCard className='swipe' 
                        key={person.name}
                        preventSwipe={['up','down']}>
                            <div className="card">
                                <h3>{person.name}</h3>
                            </div>
                        </TinderCard>
                    ))}
                </Col>
            </Row>
            <Row className="footer-buttons">
                <Col sm={8} className="accept-reject">
                    <img className="reject-icon" src="./close.png"></img>

                    <img className="accept-icon" src="./heart.png"></img>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;