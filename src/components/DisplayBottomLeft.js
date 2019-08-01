import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 2rem;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  pointer-events: none;
`;

export default function DisplayBottomLeft({ children }) {
  return <Styles>{children}</Styles>;
}
