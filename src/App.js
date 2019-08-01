import React, { useEffect } from 'react';
import styled from 'styled-components';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Map from 'components/Map';
import RoomStats from 'components/RoomStats';
import PlayerStats from 'components/PlayerStats';
import Cooldown from 'components/Cooldown';
import SettingsModal from 'components/SettingsModal';
import Footer from 'components/Footer';
import ApiError from 'components/ApiError';
import GameErrors from 'components/GameErrors';
import Inventory from 'components/Inventory';
import ButtonRow from 'components/common/ButtonRow';
import Button from 'components/common/Button';
import DisplayBottomLeft from 'components/DisplayBottomLeft';
import DisplayTopRight from 'components/DisplayTopRight';
import Shop from 'components/Shop';
import useHotKeys from 'hooks/useHotkeys';
import useGameService from 'hooks/useGameService';
import secretMapData from 'secretMapData.json';
import Loading from 'components/Loading';
import Vignette from 'components/Vignette';
import { initGameState, mockGameData, testingMode } from 'config';

const Styles = styled.div`
  min-height: 100vh;
`;

function App() {
  const [gameState, setGameState] = useLocalStorageState('GAME_STATE', initGameState);
  const { gameServerData, isLoading, apiError, actions } = useGameService(
    gameState.apiKey,
    gameState.serverData
  );
  const roomLoaded = gameState.serverData.room_id !== null;

  const setApiKey = apiKey => {
    setGameState(prev => ({
      ...prev,
      apiKey
    }));
  };

  const resetGame = () => {
    setGameState(initGameState);
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
      nextRoomId = secretMapData[gameState.serverData.room_id]['exits'][direction];
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
      serverData: gameServerData
    }));
  }, [gameServerData, setGameState]);

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
    F13: () => console.log(gameState)
    // ArrowUp: () => move('n'),
    // ArrowRight: () => move('e'),
    // ArrowDown: () => move('s'),
    // ArrowLeft: () => move('w')
  });

  // add function to take/remove item and update local inventory
  // fix up queue UI

  return (
    <Styles>
      <Header />

      <Loading isLoading={isLoading} />

      {apiError && <ApiError message={apiError.errors[0]} />}
      {!gameState.apiKey && <ApiError message="No API key, press 'z' to show settings" />}

      <Map
        mapData={secretMapData}
        currentRoomId={gameState.serverData.room_id}
        highlightRoomId={418}
        gameState={gameState}
        isLoading={isLoading}
        callbacks={{ move, takeItem, dropItem, sellItem, checkStatus, fakeRequest }}
      />

      <Vignette />

      {/* {true && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />} */}

      {roomLoaded && (
        <>
          <Cooldown secs={gameState.serverData.cooldown} />
          {/* <Cooldown secs={23} /> */}
          <DisplayTopRight>
            <PlayerStats gameState={gameState} />
            <RoomStats gameState={gameState} />
          </DisplayTopRight>
          <DisplayBottomLeft>
            {/* <GameErrors messages={[`No API key, press 'z' to show settings`, 'Another error!']} /> */}
            <GameErrors messages={gameState.serverData.errors} />
            <Shop gameState={gameState} sellItem={sellItem} />
            <Inventory gameState={gameState} dropItem={dropItem} />
            <ButtonRow>
              <Button onClick={checkStatus}>Get status</Button>
              <SettingsModal
                gameState={gameState}
                callbacks={{ setApiKey, resetGame }}
                show={false}
              />
            </ButtonRow>
          </DisplayBottomLeft>
        </>
      )}

      {!roomLoaded && (
        <>
          <DisplayBottomLeft>
            <ButtonRow>
              <Button onClick={checkStatus}>Get status</Button>
              <SettingsModal
                gameState={gameState}
                callbacks={{ setApiKey, resetGame }}
                show={false}
              />
            </ButtonRow>
          </DisplayBottomLeft>
        </>
      )}

      <Footer />
    </Styles>
  );
}

export default App;
