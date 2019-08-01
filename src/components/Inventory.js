import React from 'react';
import styled from 'styled-components';
import OverlayBox from 'components/common/OverlayBox';
import Button from 'components/common/Button';

const Styles = styled.div`
  max-width: 45rem;
  transform: scale(0.6);
  transform-origin: bottom left;
  transition: all 0.25s;
  &:hover {
    transform: scale(1);
  }
`;
const Items = styled.div`
  display: flex;
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 8rem;
  background: ${p => p.theme.colors.darkCream};
  line-height: 1;
  font-weight: bold;
  border-radius: 0.5rem;
  position: relative;
  margin-right: 0.75rem;
  text-transform: uppercase;
  text-align: center;
  cursor: default;
  button {
    display: none;
  }
  &:hover button {
    text-transform: uppercase;
    position: absolute;
    top: -1.25rem;
    right: -1.25rem;
    padding: 0.25em 0.5em;
    display: block;
    z-index: 1000;
    cursor: pointer;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1em;
  }
`;

export default function Inventory({ gameState, dropItem }) {
  const { inventory } = gameState.serverData;
  const count = inventory.length;
  return (
    <Styles>
      <OverlayBox>
        <h2>Inventory</h2>
        {count > 0 ? (
          <Items>
            {inventory.map((item, i) => (
              <Item key={i} title={item}>
                {item}
                <Button onClick={() => dropItem(item)} title={`Drop ${item}`}>
                  X
                </Button>
              </Item>
            ))}
          </Items>
        ) : (
          <div>Your inventory is empty.</div>
        )}
      </OverlayBox>
    </Styles>
  );
}
