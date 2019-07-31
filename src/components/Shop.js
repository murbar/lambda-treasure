import React from 'react';
import styled from 'styled-components';
import OverlayBox from 'components/common/OverlayBox';
import Button from 'components/common/Button';

const Styles = styled.div``;

export default function Shop({ gameState, sellItem }) {
  const inShop = gameState.serverData.room.title === 'Shop';
  const { inventory } = gameState.serverData.player;
  return inShop ? (
    <OverlayBox>
      <h2>Welcome to the shop</h2>
      {inventory.length > 0 ? (
        <>
          {inventory.map((item, key) => (
            <div key={key}>
              {gameState.serverData.room.title === 'Shop' && (
                <Button onClick={() => sellItem(item)}>Sell</Button>
              )}
            </div>
          ))}
        </>
      ) : (
        <div>You don't have anything to sell!</div>
      )}
    </OverlayBox>
  ) : null;
}
