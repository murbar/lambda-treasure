import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  box-shadow: ${p => p.theme.hudShadow};
  border-radius: 1rem;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
  h2 {
    margin: 0;
  }
`;

export default function OverlayBox({ children }) {
  return <Styles>{children}</Styles>;
}
