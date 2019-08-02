import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import OverlayBox from 'components/common/OverlayBox';
import FullScreenModal from 'components/common/FullScreenModal';
import FormField from 'components/common/FormField';
import ButtonRow from './common/ButtonRow';
import { parseUploadedFileData } from 'helpers';

const Styles = styled.div`
  width: 50rem;
  padding: 1rem;
`;

export default function SettingsModal({ gameState, callbacks, isShowing = false }) {
  const [key, setKey] = useState(gameState.apiKey);
  const [showModal, setShowModal] = useState(isShowing);
  const [statusMessage, setStatusMessage] = useState('');

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

  const handleFileUpload = e => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const mapData = parseUploadedFileData(e.target.result);
        callbacks.importMapData(mapData);
      };
      reader.readAsText(file);
      setStatusMessage('Your map data was successfully uploaded!');
    } catch (error) {
      setStatusMessage('Sorry, there was an error uploading the data.');
      console.dir(error);
    }
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
              <h3>API key</h3>
              <FormField>
                <label htmlFor="api-key">Key</label>
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
              <p>Save your map data in JSON format</p>
              <Button onClick={callbacks.exportMapData}>Export</Button>
              <p>
                Upload JSON map data - <strong>this will overwrite all existing map data</strong>
              </p>
              <input type="file" id="map-data-file" onChange={handleFileUpload} />
              {statusMessage && <div>{statusMessage}</div>}
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
