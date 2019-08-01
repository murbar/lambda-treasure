import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Map from 'components/Map';
import RoomStats from 'components/RoomStats';
import PlayerStats from 'components/PlayerStats';
import Cooldown from 'components/Cooldown';
import SettingsModal from 'components/SettingsModal';
import FindRoomModal from 'components/FindRoomModal';
import Footer from 'components/Footer';
import ApiError from 'components/ApiError';
import GameErrors from 'components/GameErrors';
import Inventory from 'components/Inventory';
import ButtonRow from 'components/common/ButtonRow';
import Button from 'components/common/Button';
import DisplayBottomLeft from 'components/DisplayBottomLeft';
import DisplayTopRight from 'components/DisplayTopRight';
import useHotKeys from 'hooks/useHotkeys';
import useGameService from 'hooks/useGameService';
import secretMapData from 'secretMapData.json';
import Loading from 'components/Loading';
import { initGameState, mockGameData, testingMode, initRoomData } from 'config';
import { updateMapData } from 'helpers';

const Styles = styled.div`
  min-height: 100%;
`;

function App() {
  const [gameState, setGameState] = useLocalStorageState('GAME_STATE', initGameState);
  const [mapData, setMapData] = useLocalStorageState('MAP_DATA', {});
  const { gameServerData, isLoading, apiError, actions } = useGameService(
    gameState.apiKey,
    gameState.serverData
  );
  const [focusRoomId, setFocusRoomId] = useState(null);
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

  const examineItem = itemName => {
    checkCooldown(() => {
      actions.examineItem(itemName);
    });
  };

  const refresh = () => {
    checkCooldown(() => {
      actions.refresh();
    });
  };

  const setRoomLabel = (roomId, label) => {
    // try {
    setMapData(prev => {
      // const room = prev[roomId]
      prev[roomId].label = label;
      return { ...prev };
    });

    // } catch (error) {
    //   console.warn
    // }
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

  // set useGameService data to game state, records room visits
  useEffect(() => {
    let prevServerData;

    setGameState(prev => {
      prevServerData = prev.serverData;
      return {
        ...prev,
        serverData: gameServerData
      };
    });

    if ('room_id' in gameServerData) {
      setMapData(prev => {
        const lastRoomId = 'room_id' in prevServerData ? prevServerData.room_id : null;
        const thisRoomId = gameServerData['room_id'];
        const move = gameServerData.lastMoveDirection;
        return updateMapData(prev, gameServerData, lastRoomId, thisRoomId, move);
      });
    }
  }, [gameServerData, setGameState, setMapData]);

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
      <Map
        mapData={secretMapData}
        // mapData={mapData}
        currentRoomId={gameState.serverData.room_id}
        focusRoomId={focusRoomId}
        gameState={gameState}
        isLoading={isLoading}
        callbacks={{ move }}
      />
      {apiError && <ApiError message={apiError.errors[0]} />}
      {!gameState.apiKey && <ApiError message="No API key, update your settings" />}
      {/* {true && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />} */}
      {roomLoaded && (
        <>
          <Cooldown secs={gameState.serverData.cooldown} />
          {/* <Cooldown secs={23} /> */}
          <Inventory gameState={gameState} callbacks={{ dropItem, sellItem, examineItem }} />
          <DisplayTopRight>
            <PlayerStats gameState={gameState} />
            <RoomStats
              gameState={gameState}
              takeItem={takeItem}
              mapData={mapData}
              setLabel={setRoomLabel}
            />
          </DisplayTopRight>
          <DisplayBottomLeft>
            {/* <GameErrors messages={[`No API key, press 'z' to show settings`, 'Another error!']} /> */}
            <GameErrors messages={gameState.serverData.errors} />
            <ButtonRow>
              <Button onClick={refresh}>Refresh</Button>
              <FindRoomModal
                gameState={gameState}
                mapData={secretMapData}
                setFocusRoomId={setFocusRoomId}
                isShowing={false}
              />
              <SettingsModal
                gameState={gameState}
                callbacks={{ setApiKey, resetGame }}
                isShowing={false}
              />
            </ButtonRow>
          </DisplayBottomLeft>
        </>
      )}
      {!roomLoaded && (
        <>
          <DisplayBottomLeft>
            <ButtonRow>
              <Button onClick={refresh}>Refresh</Button>
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
