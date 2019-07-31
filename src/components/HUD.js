import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  line-height: 1.3;
  width: 50rem;
  box-shadow: ${p => p.theme.hudShadow};
  position: absolute;
  font-size: 2rem;
  border-radius: 1rem;
  top: 2rem;
  right: 2rem;
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
  z-index: 1;
`;

export default function HUD({ gameState }) {
  const { messages, errors, cooldown } = gameState.serverData;
  const { id, description, title, exits, items, players } = gameState.serverData.room;
  const { gold, speed, encumbrance, strength, name } = gameState.serverData.player;
  return (
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
