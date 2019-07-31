import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  bottom: 25%;
  font-family: ${p => p.theme.headingFont};
  font-size: 6rem;
  color: orange;
  pointer-events: none;
  width: 100%;
  text-align: center;
  text-shadow: 0 0 1rem black, 0 0 1px black, 0 0 10rem white;
  span {
    font-size: 0.7em;
  }
`;

export default function Cooldown({ secs }) {
  return secs > 0 ? (
    <Styles>
      Cooldown {secs}
      <span>s</span>
    </Styles>
  ) : null;
}
