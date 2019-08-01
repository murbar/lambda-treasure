import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import RoomLabel from 'components/RoomLabel';
import OverlayBox from 'components/common/OverlayBox';

const Styles = styled.div`
  line-height: 1.3;
  max-width: 35rem;
  pointer-events: auto;
  h3 {
    margin: 0.5rem 0 0;
  }
  .room {
    font-family: ${p => p.theme.headingFont};
    font-size: 1.75em;
    line-height: 1;
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 1.25em;
  }
  .desc {
    font-style: italic;
  }
  .exits {
    position: absolute;
    top: 1rem;
    right: 1rem;
    span {
      text-align: center;
      text-transform: uppercase;
      font-weight: bold;
      display: inline-block;
      width: 1.3em;
      border: 1px solid black;
      border-radius: 0.25em;
      margin-right: 0.25em;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .players {
    > div {
      display: flex;
      flex-wrap: wrap;
    }
    span {
      padding: 0.25em 0.5em;
      font-size: 0.8em;
      font-weight: bold;
      color: dodgerblue;
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
    ul {
      margin: 0;
      padding-left: 2rem;
    }
  }
  z-index: 1500;
`;

export default function RoomStats({ gameState, mapData, takeItem, setLabel }) {
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
  const mapDataRoom = mapData[roomId];

  return (
    <Styles>
      <OverlayBox>
        <div className="room">
          <RoomLabel label={mapDataRoom.label} setLabel={l => setLabel(roomId, l)} /> #{roomId}
        </div>
        <div className="title">{title}</div>
        <div className="desc">{description}</div>
        <div className="exits">
          {exits.map(e => (
            <span key={e}>{e}</span>
          ))}
        </div>
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
            <h3>Players in this room</h3>
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
            <ul>
              {messages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </OverlayBox>
    </Styles>
  );
}
