import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Controls from 'components/Controls';
import Settings from 'components/Settings';
import Footer from 'components/Footer';
import useHotKeys from 'hooks/useHotkeys';
import httpService from 'services/httpService';
import gameService from 'services/gameService';

function App() {
  const [gameState, setGameState] = useLocalStorageState('gameState', {
    current_room_id: {
      id: null,
      title: '',
      description: '',
      exits: [],
      messages: [],
      errors: []
    },
    cooldown: null,
    cooldownStart: null,
    mapData: null,
    apiKey: null
  });
  const [showSettings, setShowSettings] = useState(false);

  const setApiKey = apiKey => {
    setGameState(prev => ({
      ...prev,
      apiKey
    }));
  };

  const moveDirection = direction => {
    console.log('moving', direction);
  };

  useEffect(() => {
    httpService.setToken(gameState.apiKey);
  }, [gameState.apiKey]);

  useEffect(() => {
    const initGame = async () => {
      if (gameState.apiKey) {
        const data = await gameService.checkIn();
        console.log(data);
      }
    };
    initGame();
  }, [gameState]);

  useHotKeys({
    F13: () => console.log(gameState),
    n: () => moveDirection('n'),
    e: () => moveDirection('e'),
    s: () => moveDirection('s'),
    w: () => moveDirection('w'),
    z: () => setShowSettings(prev => !prev)
  });

  return (
    <div>
      <Header />
      <Controls gameState={gameState} callbacks={{ moveDirection }} />
      {showSettings && <Settings gameState={gameState} callbacks={{ setApiKey }} />}
      <Footer />
    </div>
  );
}

export default App;
