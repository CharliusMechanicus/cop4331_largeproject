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
    const api_path = 'https://kindling-lp.herokuapp.com/';
    var update_name, update_phonenumber, update_description;
    const [current_info, setInfo] = useState({name:"", phonenumber:"", description:""});
    var token = JSON.parse(localStorage.getItem('user_data'));
    const [message, setMessage] = useState('');
    const handleClose = () => setShow(false);
    const[pic, setPic] = useState(null);

    const toggleShow = () => 
    {
        setShow((s) => !s);
        var path = 'individual';
        if (token.is_group)
            path = 'group';

        var obj = {email_str:token.email,access_token_str:token.jwtToken};
        var js = JSON.stringify(obj);
            
        fetch(api_path + 'api/get_profile_' + path,
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
        .then(res => {
            return res.json();
        })
        .then(res => {
            var user = {email:token.email, is_group:token.is_group ,jwtToken:res.refreshed_token_str};
            var user_data = JSON.stringify(user);
            localStorage.setItem('user_data', user_data);

            if (res.success_bool)
            {
                setInfo({name:res.display_name_str,
                phonenumber:res.phone_str,
                description:res.description_str}); 
            }
        });
    };

    const upload_pic = async event =>
    {
        var data = new FormData();
        data.append('profile_picture', pic);
        data.append("email_str", token.email);
        data.append('access_token_str', token.jwtToken);
        try
        {    
            const response = await fetch(api_path + 'api/upload_profile_picture',{method: "POST",body:data});
            var res = JSON.parse(await response.text());

            // Fail to upload picture
            if (!res.success_bool)
            {
                setMessage('fail to upload picture.');
            }
            // successfully setup profile
            else
            {
                setMessage('');
                var user = {email:token.email, is_group:token.is_group ,jwtToken:res.refreshed_token_str};
                localStorage.setItem('user_data', JSON.stringify(user));
                
                
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }  
    }

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
        
        if (pic != null)
            upload_pic();
    
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
                        <Col className="input-block">
                            <h3>Name: <span>{current_info.name}</span></h3>

                            <input type="text" id="update_name" placeholder="Name" ref={(c) => update_name = c}></input>
                        </Col>
                        <Col className="input-block">
                            <h3>Phone Number: <br/><span>{current_info.phonenumber}</span></h3>

                            <input type="tel" id="update_phonenumber" placeholder="Phone" ref={(c) => update_phonenumber = c}></input>
                        </Col>
                        <Col className="input-block">
                            <h3>Description:</h3>
                            
                            <span className="display-description">{current_info.description}</span>

                            <textarea className="description-h" id="update_description" rows="5" cols="40" placeholder={current_info.description} ref={(c) => update_description = c}>
                            </textarea>
                        </Col>
                        <Col className="input-block">
                            <h3>Picture Upload</h3>
                            <form encType="multipart/form-data">
                                <input id="img-upload-btn" type="file" name="fileName" accept="image/png, image/jpeg" onChange={thispic => setPic(thispic.target.files[0])}></input>
                            </form>
                            <span className="img-message">{message}</span>
                        </Col>
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
            </Offcanvas.Body>
        </Offcanvas>
        </>
    );
}

function ShowMatchList({...props }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const toggleShow = () => 
    {
        setShow((s) => !s);
       
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
    }

    var user_data = localStorage.getItem('user_data');
    var token = JSON.parse(user_data);
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const [match_list, setList] = useState(null);
    var obj = {email_str:token.email,output_select_str:'e',access_token_str:token.jwtToken};
    var js = JSON.stringify(obj);

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
                    <ListGroup className="match-user" variant="flush">
                        {match_list && match_list.map((list) =>
                            <ListGroup.Item>
                                <span className='match_list_name'>{list.display_name_str}</span>
                                <br/>
                                <span className='match_list_email'>{list.email_str}</span>
                                <br/>
                                <span className='match_list_phone'>{list.phone_str}</span>
                            </ListGroup.Item>
                        )}
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
    const [img, setImg] = useState(null);
    var card_loop = [];
    for (let i = 0; i < 10; i++) {
        card_loop.push({id:i});
    }

    // get token and form the json request.
    var token = JSON.parse(localStorage.getItem('user_data'));
    var obj = {email_str:token.email,is_group_bool:token.is_group,access_token_str:token.jwtToken};
    var js = JSON.stringify(obj);

    const get_profile_picture = async event =>
    {
        
        var obj = {email_str:target,access_token_str:token.jwtToken};
        var js = JSON.stringify(obj);
console.log(js); 
        try
        {    
            const response = await fetch(api_path + 'api/get_profile_picture',{method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
            const res = await(response.blob());
            setImg(URL.createObjectURL(res));  
console.log(img);              
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }  
    }

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
            get_profile_picture();
            // return the person object.
            setPerson({name:res.display_name_str,email:target,phone:res.phone_str,description:res.description_str});
        });
    },[target]);

    const swipe_left = () => 
    {
        setMessage("");
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
        setMessage("");
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

            if (res.match_bool === true)
            {
                setMessage("You get a new match!");
            }
                

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
        if (direction == 'left')
            swipe_left();
        // go right.
        else if (direction == 'right')
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
                {card_loop.map((card) => person && 
                    <TinderCard className='swipe_card' 	
                        key ={person.email}	
                        onSwipe={(dir) => onSwipe(dir)}	
                        preventSwipe={['up', 'down']}
                        >
                        <div className="card">
                            <img src={img} />
                            <h1>{person.name}</h1>	
                            <h2>{person.phone}</h2>	
                            <h2>{person.email}</h2>	
                            <span>{person.description}</span><br/><br/>
                        </div>
                    </TinderCard>)
                }
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