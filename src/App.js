import React, { useState, useEffect } from 'react';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import HUD from 'components/HUD';
import Controls from 'components/Controls';
import Settings from 'components/Settings';
import Footer from 'components/Footer';
import useHotKeys from 'hooks/useHotkeys';
import httpService from 'services/httpService';
import gameService from 'services/gameService';

const ErrorMessage = styled.div`
  background: crimson;
  color: white;
  padding: 2rem;
`;

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

  const resetGame = () => {
    setGameState(initState);
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
      <HUD gameState={gameState} />
      <Map />
      {isLoading && <div>LOADING</div>}
      {apiError && <ErrorMessage>ERROR {JSON.stringify(apiError)}</ErrorMessage>}
      <Controls gameState={gameState} callbacks={{ moveDirection }} />
      {showSettings && <Settings gameState={gameState} callbacks={{ setApiKey, resetGame }} />}
      <Footer />
    </div>
  );
}

export default App;
