import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  top: 2rem;
  right: 2rem;
  left: 2rem;
  z-index: 1000;
  pointer-events: none;
`;

export default function DisplayTopRight({ children }) {
  return <Styles>{children}</Styles>;
}
