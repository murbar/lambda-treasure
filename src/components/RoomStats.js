import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import OverlayBox from 'components/common/OverlayBox';

const Styles = styled.div`
  line-height: 1.3;
  font-size: 2rem;
  .room,
  .cool-down {
    font-family: ${p => p.theme.headingFont};
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
    > div {
      color: yellow;
      font-weight: bold;
    }
  }
  .cool-down {
    color: orange;
  }
  z-index: 1;
`;

export default function RoomStats({ gameState, takeItem }) {
  const { messages, errors } = gameState.serverData;
  const { id, description, title, exits, items, players } = gameState.serverData.room;
  const { gold, speed, encumbrance, strength, name } = gameState.serverData.player;
  return (
    <OverlayBox>
      <Styles>
        <div className="player">{name}</div>
        <div className="room">#{id}</div>
        <div className="title">{title}</div>
        <div className="desc">{description}</div>
        <div className="exits">Exits: {exits.map(e => e.toUpperCase()).join(', ')}</div>
        {!!items.length && (
          <div className="items">
            Items:
            {items.map((item, i) => (
              <div key={i}>
                {item} <Button onClick={() => takeItem(item)} />
              </div>
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
        {messages && (
          <div className="errors">
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
        )}
        <div>
          Gold: {gold}, Strength: {strength}, Encumbrance: {encumbrance}, Speed: {speed}
        </div>
      </Styles>
    </OverlayBox>
  );
}
