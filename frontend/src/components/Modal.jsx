import React from 'react';
import ReactDom from 'react-dom';

import styled from 'styled-components';

const Background = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: rgba( 255 , 255 , 255 , 0.8 );
    position: fixed;
    top: 0;
    left:0;
    display: flex;
    justify_content: center;
    align-items: center;
`;

const Content = styled.div`
    background-color: white;
    padding: 40px;
    border-radius: 28px;
    box-shadow: box-shadow: 0 3px 15px -3px rgba(0,0,0,0.2);
    max-width: 90%;
    margin: auto;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    text-align: center;
`;

const Modal = ({isOpen, close, children}) => {
    const portalRoot = document.getElementById("portal-root");

    if(!isOpen) return null;

    return ReactDom.createPortal(
    <Background>
        <Content>{children}</Content>
    </Background>,
     portalRoot);
}

export default Modal;