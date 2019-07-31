import React from 'react';
import styled from 'styled-components';
import OverlayBox from 'components/common/OverlayBox';

const Styles = styled.div`
  li {
    color: crimson;
  }
`;

export default function GameErrors({ messages = [] }) {
  return messages.length > 0 ? (
    <OverlayBox>
      <Styles>
        <h2>Oh no!</h2>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Styles>
    </OverlayBox>
  ) : null;
}
