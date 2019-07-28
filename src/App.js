import React, { useEffect } from 'react';
import useLocalStorageState from 'hooks/useLocalStorageState';
import Header from 'components/Header';
import Controls from 'components/Controls';
import Footer from 'components/Footer';
import useHotKeys from 'hooks/useHotkeys';

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

  useEffect(() => {}, []);

  useHotKeys({
    d: () => console.log(gameState)
  });

  return (
    <div>
      <Header />
      <Controls gameState={gameState} />
      <Footer />
    </div>
  );
}

export default App;
