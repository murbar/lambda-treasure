import React from 'react';
import styled from 'styled-components';
import OverlayBox from 'components/common/OverlayBox';
import Button from 'components/common/Button';

const Styles = styled.div``;
const Items = styled.div`
  display: flex;
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7rem;
  height: 7rem;
  background: ${p => p.theme.colors.darkCream};
  line-height: 1;
  font-weight: bold;
  border-radius: 0.5rem;
  position: relative;
  margin-right: 0.5rem;
  text-transform: uppercase;
  text-align: center;
  cursor: default;
  button {
    display: none;
  }
  &:hover button {
    text-transform: uppercase;
    position: absolute;
    top: -1rem;
    right: -1rem;
    padding: 0 0.25em;
    display: block;
    z-index: 1000;
    cursor: pointer;
    border-radius: 0.25em;
    font-weight: bold;
    font-size: 1em;
  }
`;

export default function Inventory({ gameState, dropItem }) {
  const { inventory } = gameState.serverData;
  const count = inventory.length;
  return (
    <OverlayBox>
      <Styles>
        <h2>Inventory</h2>
        {count > 0 ? (
          <Items>
            {inventory.map((item, i) => (
              <Item key={i} title={item}>
                {item}
                <Button onClick={() => dropItem(item)} title={`Drop ${item}`}>
                  Drop
                </Button>
              </Item>
            ))}
          </Items>
        ) : (
          <div>Your inventory is empty.</div>
        )}
      </Styles>
    </OverlayBox>
  );
}
