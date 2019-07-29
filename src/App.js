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

const parseCoordinates = coords => {
  return coords.slice(1, coords.length - 1).split(',');
};

const ErrorMessage = styled.div`
  background: crimson;
  color: white;
  padding: 2rem;
`;

const initState = {
  apiKey: null,
  mapData: null,
  serverData: null,
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

  const travel = direction => {
    if (!gameData.room.coolDown) {
      actions.move(direction);
    } else {
      setGameState(prev => {
        const messages = [...prev.currentRoom.messages];
        messages.push(`Cool down in effect, wait to move`);
        return {
          ...prev,
          currentRoom: {
            ...prev.currentRoom,
            messages
          }
        };
      });
    }
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

  useHotKeys({
    F13: () => console.log(gameState),
    // n: () => travel('n'),
    // e: () => travel('e'),
    // s: () => travel('s'),
    // w: () => travel('w'),
    z: () => setShowSettings(prev => !prev)
  });

  return (
    <div>
      <Header />
      {gameState.serverData && (
        <>
          <HUD gameState={gameState} />
          <Map />
          <Controls gameState={gameState} callbacks={{ travel }} />
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
