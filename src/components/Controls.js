import React from 'react';
import styled from 'styled-components';
import compass from 'images/compass-small.svg';

const Styles = styled.div``;

const Directions = styled.div`
  width: 12rem;
  margin-left: 20rem;
  transform: rotate(6deg);
  background: url(${compass}) center / 100% no-repeat;
  button {
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border: none;
    background: transparent;
    margin: 0;
    font-family: ${p => p.theme.font};
    font-size: 1.5em;
    &:hover {
      color: ${p => p.theme.colors.primary};
    }
    &[disabled] {
      color: #aaa;
    }
  }
  button:nth-child(1),
  button:nth-child(4) {
    margin: 0 4rem;
  }
  button:nth-child(2) {
    margin-right: 4rem;
  }
`;

export default function Controls({ gameState, callbacks }) {
  const exits = gameState.currentRoom.id ? gameState.currentRoom.exits : null;
  const { travel } = callbacks;

  return (
    <Styles>
      {exits && (
        <Directions>
          <button disabled={!exits.includes('n')} onClick={() => travel('n')}>
            N
          </button>
          <button disabled={!exits.includes('w')} onClick={() => travel('w')}>
            W
          </button>
          <button disabled={!exits.includes('e')} onClick={() => travel('e')}>
            E
          </button>
          <button disabled={!exits.includes('s')} onClick={() => travel('s')}>
            S
          </button>
        </Directions>
      )}
    </Styles>
  );
}
