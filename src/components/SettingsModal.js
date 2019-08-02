import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import OverlayBox from 'components/common/OverlayBox';
import FullScreenModal from 'components/common/FullScreenModal';
import FormField from 'components/common/FormField';
import ButtonRow from './common/ButtonRow';

const Styles = styled.div`
  width: 50rem;
  padding: 1rem;
`;

export default function SettingsModal({ gameState, callbacks, isShowing = false }) {
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
              <h3>Map data</h3>
              <Button onClick={callbacks.exportMapData}>Export</Button>
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
