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
  currentRoom: { id: null },
  coolDown: 0,
  mapData: null,
  apiKey: null
};

function App() {
  const [gameState, setGameState] = useLocalStorageState('gameState', initState);
  const [showSettings, setShowSettings] = useState(false);
  const { roomData, isLoading, apiError, checkIn, move } = useGameService(gameState.apiKey);

  const setApiKey = apiKey => {
    setGameState(prev => ({
      ...prev,
      apiKey
    }));
  };

  const resetGame = () => {
    setGameState(initState);
  };

  useEffect(() => {
    if (gameState.coolDown > 0) {
      const timeOut = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          coolDown: Math.ceil((prev.coolDown -= 1))
        }));
      }, 1000);
      return () => clearTimeout(timeOut);
    }
  }, [gameState.coolDown, setGameState]);

  useEffect(() => {
    if (roomData) {
      const [x, y] = parseCoordinates(roomData.coordinates);
      setGameState(prev => ({
        ...prev,
        currentRoom: {
          id: roomData.room_id,
          title: roomData.title,
          description: roomData.description,
          exits: roomData.exits,
          coordinates: { x, y },
          errors: roomData.errors,
          messages: roomData.messages
        },
        coolDown: Math.ceil(roomData.cooldown)
      }));
    }
  }, [roomData, setGameState]);

  useEffect(() => {
    if (apiError && apiError.cooldown) {
      setGameState(prev => ({
        ...prev,
        coolDown: Math.ceil(apiError.cooldown)
      }));
    }
  }, [apiError, setGameState]);

  useHotKeys({
    F13: () => console.log(gameState),
    n: () => move('n'),
    e: () => move('e'),
    s: () => move('s'),
    w: () => move('w'),
    z: () => setShowSettings(prev => !prev)
  });

  return (
    <div>
      <Header />
      <HUD gameState={gameState} />
      <Map />
      {isLoading && <div>LOADING</div>}
      {apiError && <ErrorMessage>ERROR {JSON.stringify(apiError)}</ErrorMessage>}
      <Controls gameState={gameState} callbacks={{ move }} />
      {showSettings && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />}
      <Footer />
    </div>
  );
}

export default App;
