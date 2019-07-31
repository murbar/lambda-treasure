import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  background: ${p => p.theme.backgroundGradient};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -999;
`;

export default function Vignette() {
  return <Styles />;
}
