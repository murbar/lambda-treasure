import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import compass from 'images/compass-small.svg';

const Styles = styled.div``;

const Directions = styled.div`
  width: 12rem;
  margin: 1rem;
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
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: ${p => p.theme.colors.primary};
    }
    &[disabled] {
      cursor: default;
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
  const { exits, items } = gameState.serverData.room;
  const { inventory } = gameState.serverData.player;
  const { move, takeItem, dropItem, checkStatus } = callbacks;

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
      {items &&
        items.map((item, key) => (
          <Button key={key} onClick={() => takeItem(item)}>
            Pick up {item}
          </Button>
        ))}
      {inventory && (
        <div>
          <h2>Inventory ({inventory.length})</h2>
          {inventory.map((item, key) => (
            <Button key={key} onClick={() => dropItem(item)}>
              Drop {item}
            </Button>
          ))}
        </div>
      )}
      <Button onClick={checkStatus}>Get status</Button>
    </Styles>
  );
}
