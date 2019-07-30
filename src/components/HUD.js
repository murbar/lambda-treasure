import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 1rem;
  line-height: 1.3;
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
  .items {
    > div {
      color: yellow;
      font-weight: bold;
    }
  }
  .cool-down {
    color: orange;
  }
`;

export default function HUD({ gameState }) {
  const { messages, errors, cooldown } = gameState.serverData;
  const { id, description, title, exits, items, players } = gameState.serverData.room;
  const { gold, speed, encumbrance, strength } = gameState.serverData.player;
  return (
    <Styles>
      <div className="room">#{id}</div>
      <div className="title">{title}</div>
      <div className="desc">{description}</div>
      <div className="exits">Exits: {exits.map(e => e.toUpperCase()).join(', ')}</div>
      {!!items.length && (
        <div className="items">
          Items:
          {items.map((item, i) => (
            <div key={i}>{item}</div>
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
      {players && (
        <div className="errors">
          Players:
          {players.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}
      {messages && (
        <div className="errors">
          {messages.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}
      {cooldown > 0 && <div className="cool-down">CD {cooldown}</div>}
      <div>
        Gold: {gold}, Strength: {strength}, Encumbrance: {encumbrance}, Speed: {speed}
      </div>
    </Styles>
  );
}
