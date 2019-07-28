import React from 'react';
import styled from 'styled-components';

const Styles = styled.div``;

const Directions = styled.div`
  width: 8rem;
  margin-left: 20rem;
  button {
    display: inline-block;
    width: 4rem;
    height: 3rem;
    border: none;
    background: #ccc;
    margin: 0;
  }
  button:nth-child(1),
  button:nth-child(4) {
    margin: 0 2rem;
  }
`;

export default function Controls({ gameState, callbacks }) {
  const exits = gameState.currentRoom.id ? gameState.currentRoom.exits : null;
  const { move } = callbacks;

  return (
    <Styles>
      {exits && (
        <Directions>
          <button disabled={!exits.includes('n')} onClick={() => move('n')}>
            N
          </button>
          <button disabled={!exits.includes('w')} onClick={() => move('w')}>
            W
          </button>
          <button disabled={!exits.includes('e')} onClick={() => move('e')}>
            E
          </button>
          <button disabled={!exits.includes('s')} onClick={() => move('s')}>
            S
          </button>
        </Directions>
      )}
    </Styles>
  );
}
