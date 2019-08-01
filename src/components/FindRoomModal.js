import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import OverlayBox from 'components/common/OverlayBox';
import FullScreenModal from 'components/common/FullScreenModal';
import FormField from 'components/common/FormField';
import ButtonRow from './common/ButtonRow';

const Styles = styled.div`
  width: 30rem;
  padding: 1rem;
`;

export default function SettingsModal({ gameState, mapData, setFocus, isShowing = false }) {
  const [room, setRoom] = useState(gameState.serverData.room_id);
  const [showModal, setShowModal] = useState(isShowing);

  useEffect(() => {
    setShowModal(isShowing);
  }, [isShowing]);

  const save = () => {
    setFocus(room);
    // setShowModal(false);
  };

  const handleChange = e => {
    setRoom(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') save();
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Find Room</Button>
      {showModal && (
        <FullScreenModal>
          <OverlayBox>
            <Styles>
              <h2>Find room by ID</h2>
              <FormField>
                <label htmlFor="room-id">Room #</label>
                <Input
                  type="text"
                  id="room-id"
                  placeholder="000"
                  value={room || ''}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </FormField>
              <ButtonRow>
                <Button onClick={save}>Find</Button>
              </ButtonRow>
            </Styles>
          </OverlayBox>
        </FullScreenModal>
      )}
    </>
  );
}
