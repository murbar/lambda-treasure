import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  width: 90%;
  max-width: 50rem;
  z-index: 1000;
`;

export default function DisplayBottomLeft({ children }) {
  return <Styles>{children}</Styles>;
}
