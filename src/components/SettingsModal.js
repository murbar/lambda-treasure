import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import OverlayBox from 'components/common/OverlayBox';
import ButtonRow from './common/ButtonRow';

const FullScreenModal = styled.div`
  position: fixed;
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
  input {
    flex-grow: 1;
  }
`;

export default function SettingsModal({ gameState, callbacks, isShowing }) {
  const [key, setKey] = useState(gameState.apiKey);
  const [showModal, setShowModal] = useState(isShowing);

  useEffect(() => {
    setShowModal(isShowing);
  }, [isShowing]);

  const save = () => {
    callbacks.setApiKey(key);
    setShowModal(false);
  };

  const handleChange = e => {
    setKey(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') save();
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Settings</Button>
      {showModal && (
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
              <ButtonRow>
                <Button onClick={save}>Save & Close</Button>
                <Button onClick={callbacks.resetGame}>Reset Game</Button>
              </ButtonRow>
            </Styles>
          </OverlayBox>
        </FullScreenModal>
      )}
    </>
  );
}
