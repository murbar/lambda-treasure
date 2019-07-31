import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Map from 'components/Map';
import HUD from 'components/HUD';
import Cooldown from 'components/Cooldown';
import Settings from 'components/Settings';
import Footer from 'components/Footer';
import ApiError from 'components/ApiError';
import GameErrors from 'components/GameErrors';
import Inventory from 'components/Inventory';
import ButtonRow from 'components/common/ButtonRow';
import Button from 'components/common/Button';
import DisplayBottomLeft from 'components/DisplayBottomLeft';
import Shop from 'components/Shop';
import useHotKeys from 'hooks/useHotkeys';
import useGameService from 'hooks/useGameService';
import secretMapData from 'secretMapData.json';
import Loading from 'components/Loading';

const initState = {
  apiKey: null,
  mapData: null,
  serverData: { room: { id: null } },
  apiError: null
};

const Styles = styled.div`
  min-height: 100vh;
`;

function App() {
  const [gameState, setGameState] = useLocalStorageState('GAME_STATE', initState);
  const { gameData, isLoading, apiError, actions } = useGameService(gameState.apiKey);
  const [showSettings, setShowSettings] = useState(false);
  const roomLoaded = gameState.serverData.room.id !== null;

  const setApiKey = apiKey => {
    setGameState(prev => ({
      ...prev,
      apiKey
    }));
  };

  const resetGame = () => {
    setGameState(initState);
  };

  const checkCooldown = action => {
    if (!gameState.serverData.cooldown) {
      action();
    } else {
      setGameState(prev => {
        const messages = [...prev.serverData.messages];
        messages.push(`Cool down in effect, please wait`);
        return {
          ...prev,
          serverData: {
            ...prev.serverData,
            messages
          }
        };
      });
    }
  };

  const move = direction => {
    let nextRoomId = null;
    try {
      nextRoomId = secretMapData[gameState.serverData.room.id]['exits'][direction];
    } catch (error) {
      console.warn('cannot get next room ID from map data');
    }
    checkCooldown(() => {
      actions.move(direction, nextRoomId);
    });
  };

  const takeItem = itemName => {
    checkCooldown(() => {
      actions.takeItem(itemName);
    });
  };

  const fakeRequest = () => {
    checkCooldown(() => {
      console.log('making fake request');
    });
    setGameState(prev => {
      return {
        ...prev,
        serverData: {
          ...prev.serverData,
          cooldown: 5
        }
      };
    });
  };

  const dropItem = itemName => {
    checkCooldown(() => {
      actions.dropItem(itemName);
    });
  };

  const sellItem = itemName => {
    checkCooldown(() => {
      actions.sellItem(itemName);
    });
  };

  const checkStatus = () => {
    checkCooldown(() => {
      actions.checkPlayerStatus();
    });
  };

  // decrement cool down once per second
  useEffect(() => {
    if (gameState.serverData && gameState.serverData.cooldown > 0) {
      const timeOut = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          serverData: {
            ...prev.serverData,
            cooldown: Math.ceil((prev.serverData.cooldown -= 1))
          }
        }));
      }, 1000);
      return () => clearTimeout(timeOut);
    }
  }, [gameState, setGameState]);

  // set useGameService data to game state
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      serverData: gameData
    }));
  }, [gameData, setGameState]);

  // increment cool down on api response error
  useEffect(() => {
    if (apiError && apiError.cooldown) {
      setGameState(prev => ({
        ...prev,
        serverData: {
          ...prev.serverData,
          cooldown: Math.ceil(apiError.cooldown)
        }
      }));
    }
  }, [apiError, setGameState]);

  // selectively activate hotkeys when inputs not in focus
  useHotKeys({
    F13: () => console.log(gameState),
    // ArrowUp: () => move('n'),
    // ArrowRight: () => move('e'),
    // ArrowDown: () => move('s'),
    // ArrowLeft: () => move('w'),
    z: () => setShowSettings(prev => !prev)
  });

  return (
    <Styles>
      <Header />

      <Loading isLoading={isLoading} />

      {apiError && <ApiError messages={JSON.stringify(apiError)} />}
      {!gameState.apiKey && <ApiError messages="No API key, press 'z' to show settings" />}

      {roomLoaded && (
        <>
          <Cooldown secs={gameState.serverData.cooldown} />
          {/* <Cooldown secs={23} /> */}
          <HUD gameState={gameState} />
          <DisplayBottomLeft>
            {/* <GameErrors messages={[`No API key, press 'z' to show settings`, 'Another error!']} /> */}
            <GameErrors messages={gameState.serverData.errors} />
            <Shop gameState={gameState} sellItem={sellItem} />
            <Inventory gameState={gameState} dropItem={dropItem} />
            <ButtonRow>
              <Button onClick={checkStatus}>Get status</Button>
            </ButtonRow>
          </DisplayBottomLeft>
        </>
      )}

      {showSettings && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />}

      <Map
        mapData={secretMapData}
        currentRoomId={gameState.serverData.room.id}
        highlightRoomId={329}
        gameState={gameState}
        isLoading={isLoading}
        callbacks={{ move, takeItem, dropItem, sellItem, checkStatus, fakeRequest }}
      />

      <Footer />
    </Styles>
  );
}

export default App;
