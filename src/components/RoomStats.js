import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import OverlayBox from 'components/common/OverlayBox';

const Styles = styled.div`
  line-height: 1.3;
  font-size: 2rem;
  max-width: 45rem;
  pointer-events: auto;
  .room {
    font-family: ${p => p.theme.headingFont};
    font-size: 1.75em;
    line-height: 1;
  }
  .title {
    font-size: 1.25em;
  }
  .desc {
    font-style: italic;
  }
  .players {
    > div {
      display: flex;
      flex-wrap: wrap;
    }
    span {
      padding: 0.25em;
      font-size: 0.8em;
    }
  }
  .items {
    button {
      font-weight: bold;
      background: #333;
      color: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
      display: inline-block;
      font-size: 0.8em;
      text-transform: uppercase;
      padding: 0 0.5rem;
      margin-right: 1rem;
    }
  }
  .messages {
    h3 {
      margin: 0.5rem 0 0;
    }
  }
  z-index: 1500;
`;

export default function RoomStats({ gameState, takeItem }) {
  const {
    messages,
    errors,
    room_id: roomId,
    description,
    title,
    exits,
    items,
    players
  } = gameState.serverData;
  return (
    <Styles>
      <OverlayBox>
        <div className="room">#{roomId}</div>
        <div className="title">{title}</div>
        <div className="desc">{description}</div>
        <div className="exits">Exits: {exits.map(e => e.toUpperCase()).join(', ')}</div>
        {!!items.length && (
          <div className="items">
            {items.map((item, i) => (
              <Button key={i} onClick={() => takeItem(item)} title={`Take ${item}`}>
                {`${item} +`}
              </Button>
            ))}
          </div>
        )}
        {errors && (
          <div className="errors">
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}
        {players.length > 0 && (
          <div className="players">
            Players:
            <div>
              {players.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
        )}
        {messages.length > 0 && (
          <div className="messages">
            <h3>Messages</h3>
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
        )}
      </OverlayBox>
    </Styles>
  );
}
