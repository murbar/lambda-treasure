import React from 'react';
import styled from 'styled-components';
import OverlayBox from 'components/common/OverlayBox';
import Button from 'components/common/Button';

const Styles = styled.div``;

export default function Inventory({ gameState, dropItem }) {
  const { inventory } = gameState.serverData.player;
  const count = inventory.length;
  return (
    <OverlayBox>
      <Styles>
        <h2>Inventory</h2>
        {count > 0 ? (
          <div>
            {inventory.map((item, i) => (
              <div key={i}>
                {item} <Button onClick={() => dropItem(item)}>Drop</Button>
              </div>
            ))}
          </div>
        ) : (
          <div>Your inventory is empty.</div>
        )}
      </Styles>
    </OverlayBox>
  );
}
