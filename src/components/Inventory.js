import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';

const Items = styled.div`
  display: flex;
  flex-flow: column;
`;

const Item = styled.div`
  transform: rotate(10deg);
  transform-origin: bottom left;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 12rem;
  height: 4rem;
  background: ${p => p.theme.inventory.itemBgGradient};
  line-height: 1;
  color: white;
  font-weight: bold;
  font-size: 0.8em;
  border-radius: 0.5rem;
  position: relative;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  text-align: center;
  cursor: default;
  transition: all 0.25s;
  .actions {
    position: absolute;
    top: -0.5rem;
    left: 10.5rem;
    text-align: left;
    display: none;
    padding: 2rem;
    &:hover {
      display: block;
    }
    button {
      flex-shrink: 0;
      padding: 0.25em 0.5em;
      z-index: 1000;
      cursor: pointer;
      font-size: 1em;
      margin-bottom: 0.5rem;
    }
  }
  &:hover .actions {
    display: block;
  }
`;

const Styles = styled.div`
  max-width: 45rem;
  transform: scale(0.6) translateX(-5rem);
  transform-origin: top left;
  transition: all 0.25s;
  pointer-events: auto;
  padding: 1rem;
  border-radius: 1rem 1rem 0 0;
  position: absolute;
  left: 0;
  top: 10rem;

  h2 {
    transform: rotate(10deg);
    transform-origin: bottom left;
    text-align: right;
    transition: all 0.25s;
  }
  &:hover {
    background: ${p => p.theme.queue.bgColor};
    h2 {
      transform: rotate(0);
    }
    transform: scale(1) translateX(0);
    ${Item} {
      transform: rotate(0);
    }
  }
`;

export default function Inventory({ gameState, callbacks }) {
  const { inventory } = gameState.serverData;
  const { examineItem, dropItem, sellItem } = callbacks;
  const count = inventory.length;
  const inShop = gameState.serverData.title === 'Shop';

  return count > 0 ? (
    <Styles>
      <h2>Inventory</h2>
      <Items>
        {inventory.map((item, i) => (
          <Item key={i} title={item}>
            {item}
            <div className="actions">
              <Button onClick={() => examineItem(item)} title={`Examine ${item}`}>
                Examine
              </Button>
              <Button onClick={() => dropItem(item)} title={`Drop ${item}`}>
                Drop
              </Button>
              {inShop && (
                <Button onClick={() => sellItem(item)} title={`Sell ${item}`}>
                  Sell
                </Button>
              )}
            </div>
          </Item>
        ))}
      </Items>
    </Styles>
  ) : null;
}
