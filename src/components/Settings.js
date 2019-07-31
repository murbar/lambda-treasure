// fullscreen modal?

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import OverlayBox from 'components/common/OverlayBox';

const FullScreenModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`;

const Styles = styled.div`
  width: 50rem;
  padding: 1rem;
`;

const FormField = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  label {
    padding: 0 1rem;
    text-transform: uppercase;
    font-weight: bold;
  }
`;

export default function Settings({ gameState, callbacks }) {
  const [key, setKey] = useState(gameState.apiKey);

  const save = () => {
    callbacks.setApiKey(key);
  };

  const handleChange = e => {
    setKey(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') save();
  };

  return (
    <FullScreenModal>
      <OverlayBox>
        <Styles>
          <h2>Settings</h2>
          <p>Press 'z' to hide settings</p>
          <FormField>
            <label htmlFor="api-key">API Key</label>
            <Input
              type="text"
              id="api-key"
              placeholder="Token xxxxxxxxxxxxxxxxxxx"
              value={key || ''}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </FormField>
          <Button onClick={save}>Save</Button>
          <Button onClick={callbacks.resetGame}>Reset Game</Button>
        </Styles>
      </OverlayBox>
    </FullScreenModal>
  );
}
