import React, { useState } from "react";
import storage from '../tokenStorage.js';
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';

export default function InitializeProfile()
{
    const api_path = 'https://kindling-lp.herokuapp.com/';
    const[message, setMessage] = useState('');
    
    const[showDescription, setShowDescription] = useState(false);
    const[game_development, set_game_development] = useState(false);
    const[app_development, set_app_development] = useState(false);
    const[web_development, set_web_development] = useState(false);
    const[robotics, set_robotics] = useState(false);
    const[graphic_design, set_graphic_design] = useState(false);
    const[writer, set_writer] = useState(false);
    const[marketing, set_marketing] = useState(false);
    const[networking, set_networking] = useState(false);
    const[construction, set_construction] = useState(false);
    const[lab_partners, set_lab_partners] = useState(false);
    const[research, set_research] = useState(false);
    const[other, set_other] = useState(false);

    var description;
    var token = JSON.parse(localStorage.getItem('user_data'));
    
    var profile = token.is_group ? 
    {
        email_str: token.email,
        group_categories_obj: [],
        description_str: '',
        candidate_individual_categories_obj: {
          game_development_bool: game_development,
          app_development_bool: app_development,
          web_development_bool: web_development,
          robotics_bool: robotics,
          graphic_design_bool: graphic_design,
          writer_bool: writer,
          marketing_bool: marketing,
          networking_bool: networking,
          construction_bool: construction,
          lab_partners_bool: lab_partners,
          research_bool: research,
          other_bool: other
        },
        access_token_str: token.jwtToken,
    } 
    :
    {
        email_str: token.email,
        individual_categories_obj: [],
        description_str: '',
        candidate_group_categories_obj: {
          game_development_bool: game_development,
          app_development_bool: app_development,
          web_development_bool: web_development,
          robotics_bool: robotics,
          graphic_design_bool: graphic_design,
          writer_bool: writer,
          marketing_bool: marketing,
          networking_bool: networking,
          construction_bool: construction,
          lab_partners_bool: lab_partners,
          research_bool: research,
          other_bool: other
        },
        access_token_str: token.jwtToken,
      };

    const doLogout = async event => 
    {
        window.location.href = '/';
    }
    
    const save_tages = async event =>
    {
        var num_select = 0;
        if (token.is_group)
            for (var obj in profile.candidate_individual_categories_obj)
            {
                if (profile.candidate_individual_categories_obj[obj])
                    num_select++;
            }
        else
            for (var obj in profile.candidate_group_categories_obj)
            {
                if (profile.candidate_group_categories_obj[obj])
                    num_select++;
            }

        if (num_select < 1)
            setMessage('Please select at least one field.');
        else
            setShowDescription(true);
    }

    const save_profile = async event =>
    { 
        setMessage('');

        if (description == '')
        setMessage('Please add some description.');
        else
        {
            profile.description_str = description.value;
            var js = JSON.stringify(profile);
            try
            {   
                var response;
                if (token.is_group)
                    response = await fetch(api_path + 'api/initialize_profile_group',
                        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
                else
                    response = await fetch(api_path + 'api/initialize_profile_individual',
                        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
                
                var res = JSON.parse(await response.text());

                // Fail to setup profile
                if (!res.success_bool)
                {
                    setMessage('Unexpect error happened, please try again.');
                }
                // successfully setup profile
                else
                {
                    setMessage('');
                    var user = {email:token.email, is_group:token.is_group ,jwtToken:res.refreshed_token_str};
                    localStorage.setItem('user_data', JSON.stringify(user));
                    
                    window.location.href = '/Home';
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
        <Container>
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
                        Descriptions 
                        <span id="pw-warning">{message}</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {showDescription ?
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <h5 className="option-header">What would you like everyone to know?</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-blanket">
                                        <textarea className="description" rows="5" cols="40" placeholder="Type something to get people interested!" ref={(c) => description = c}>
                                        </textarea>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <h5 className="option-header">Select any amount</h5>
                                    </Col>
                                </Row>
                                <Row className="description-options">
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-01" onClick={() => set_game_development(!game_development)}/>
                                            <label className="ninja-label" for="option-01">
                                                <span className="ninja-text">game development</span>
                                            </label>
                                        </div>
                                    
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-02" onClick={() => set_app_development(!app_development)}/>
                                            <label className="ninja-label" for="option-02">
                                                <span className="ninja-text">app development</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-03" onClick={() => set_web_development(!web_development)}/>
                                            <label className="ninja-label" for="option-03">
                                                <span className="ninja-text">web development</span>
                                            </label>
                                        </div>
                                    
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-04" onClick={() => set_robotics(!robotics)}  value='robotics'/>
                                            <label className="ninja-label" for="option-04">
                                                <span className="ninja-text">robotics</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-05" onClick={() => set_graphic_design(!graphic_design)}/>
                                            <label className="ninja-label" for="option-05">
                                                <span className="ninja-text">graphic design</span>
                                            </label>
                                        </div>
                    
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-06" onClick={() => set_writer(!writer)}/>
                                            <label className="ninja-label" for="option-06">
                                                <span className="ninja-text">writer</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-07" onClick={() => set_marketing(!marketing)}/>
                                            <label className="ninja-label" for="option-07">
                                                <span className="ninja-text">marketing</span>
                                            </label>
                                        </div>
                            
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-08" onClick={() => set_networking(!networking)}/>
                                            <label className="ninja-label" for="option-08">
                                                <span className="ninja-text">networking</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-09" onClick={() => set_construction(!construction)}/>
                                            <label className="ninja-label" for="option-09">
                                                <span className="ninja-text">construction</span>
                                            </label>
                                        </div>

                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-10" onClick={() => set_lab_partners(!lab_partners)}/>
                                            <label className="ninja-label" for="option-10">
                                                <span className="ninja-text">lab partners</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col className="duo-group">
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-11" onClick={() => set_research(!research)}/>
                                            <label className="ninja-label" for="option-11">
                                                <span className="ninja-text">research</span>
                                            </label>
                                        </div>
                                        
                                        <div className="imposter">
                                            <input type="checkbox" className="ninja-input" id="option-12" onClick={() => set_other(!other)}/>
                                            <label className="ninja-label" for="option-12">
                                                <span className="ninja-text">other</span>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    }
                </Modal.Body>

                <Modal.Footer className="initial-footer">
                    <button className='logout-btn-footer' onClick={doLogout}>Logout</button>

                    {showDescription ?
                        <button className="continue-btn" onClick={save_profile}>Continue</button>
                        :
                        <button className="continue-btn" onClick={save_tages}>Continue</button>
                    }
                </Modal.Footer>
            </Modal>
        </Container>
    );
}