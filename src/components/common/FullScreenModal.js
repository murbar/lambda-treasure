import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Styles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
`;

export default function FullScreenModal({ children }) {
  return ReactDOM.createPortal(<Styles>{children}</Styles>, document.querySelector('#modal'));
}
