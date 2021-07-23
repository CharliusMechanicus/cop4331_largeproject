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
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
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
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
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
                    
                    {/* <Link to="/Settings">
                        <img className="person-icon" src="./person.png"></img>
                    </Link> */}
                </Col>
                <Col className="header-logo">
                    <img className="fire-icon" src='/kindling-icon.png'></img>
                </Col>
                <Col className="matchlist-btn">
                    {options.map((props, idx) => (
                        <ShowSettings key={idx} placement={'end'} {...props} />
                    ))}
                    {/* <Link to="/MatchList">
                        <img className="menu-icon" src="./menu.png"></img>
                    </Link> */}
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
                {/* <Col>
                {options.map((props, idx) => (
                    <ShowSettings key={idx} {...props} />
                ))}
                </Col> */}
            </Row>
        </Container>
    );
}

export default Home;