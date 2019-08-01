import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './common/Button';
import ButtonRow from 'components/common/ButtonRow';
import OverlayBox from 'components/common/OverlayBox';

const Styles = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 30%;
  font-size: 1.25em;
  > div {
    min-width: 35rem;
  }
`;

export default function ApiError({ message }) {
  const [showing, setShowing] = useState(true);

  return showing ? (
    <Styles>
      <OverlayBox>
        <h2>API error :(</h2>
        {message}
        <ButtonRow>
          <Button onClick={() => setShowing(false)}>Ok</Button>
        </ButtonRow>
      </OverlayBox>
    </Styles>
  ) : null;
}
