import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  max-width: 50rem;
`;

export default function DisplayTopRight({ children }) {
  return <Styles>{children}</Styles>;
}
