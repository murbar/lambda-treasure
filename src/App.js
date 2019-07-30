import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Map from 'components/Map';
import HUD from 'components/HUD';
import Controls from 'components/Controls';
import Settings from 'components/Settings';
import Footer from 'components/Footer';
import useHotKeys from 'hooks/useHotkeys';
import useGameService from 'hooks/useGameService';
import secretMapData from 'secretMapData.json';

const ErrorMessage = styled.div`
  background: crimson;
  color: white;
  padding: 2rem;
`;

const initState = {
  apiKey: null,
  mapData: null,
  serverData: { room: { id: null } },
  apiError: null
};

function App() {
  const [gameState, setGameState] = useLocalStorageState('GAME_STATE', initState);
  const { gameData, isLoading, apiError, actions } = useGameService(gameState.apiKey);
  const [showSettings, setShowSettings] = useState(false);

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

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      serverData: gameData
    }));
  }, [gameData, setGameState]);

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
    ArrowUp: () => move('n'),
    ArrowRight: () => move('e'),
    ArrowDown: () => move('s'),
    ArrowLeft: () => move('w'),
    z: () => setShowSettings(prev => !prev)
  });

  return (
    <div>
      <Header />
      {gameState.serverData.room.id !== null && (
        <>
          <HUD gameState={gameState} />
          <Map
            mapData={secretMapData}
            currentRoomId={gameState.serverData.room.id}
            highlightRoomId={461}
          />
        </>
      )}
      {isLoading && <div>LOADING</div>}
      {apiError && <ErrorMessage>ERROR {JSON.stringify(apiError)}</ErrorMessage>}
      {!gameState.apiKey && <ErrorMessage>No API key, press 'z' to show settings</ErrorMessage>}
      {showSettings && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
