import { useState, useEffect, useCallback } from 'react';
import gameService from 'services/gameService';
import httpService from 'services/httpService';

const parseCoordinates = coords => {
  return coords.slice(1, coords.length - 1).split(',');
};

const initGameData = {
  room: {
    id: null,
    title: '',
    description: '',
    players: [],
    items: [],
    exits: [],
    coordinates: { x: null, y: null },
    terrain: '',
    elevation: 0
  },
  player: {
    name: '',
    encumbrance: 0,
    strength: 0,
    speed: 0,
    gold: 0,
    inventory: [],
    status: []
  },
  cooldown: 0,
  errors: [],
  messages: []
};

const useGameService = apiKey => {
  // const [roomData, setRoomData] = useState(null);
  // const [playerData, setPLayerData] = useState(null);
  const [gameData, setGameData] = useState(initGameData);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const requestWrapper = cb => async (...args) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await cb(...args);
      setIsLoading(false);
    } catch (error) {
      console.dir(error);
      setApiError(error.response.data);
      setIsLoading(false);
    }
  };

  const checkIn = useCallback(
    requestWrapper(async () => {
      const { data } = await gameService.checkIn();
      const {
        cooldown,
        errors,
        messages,
        room_id,
        title,
        description,
        elevation,
        terrain,
        players,
        items,
        exits
      } = data;
      const [x, y] = parseCoordinates(data.coordinates);
      setGameData(prev => {
        return {
          ...prev,
          cooldown,
          errors,
          messages,
          room: {
            ...prev.room,
            id: room_id,
            title,
            description,
            coordinates: { x, y },
            elevation,
            terrain,
            players,
            items,
            exits
          }
        };
      });
    }),
    []
  );

  const checkPlayerStatus = useCallback(
    requestWrapper(async () => {
      const { data } = await gameService.checkStatus();
      const {
        cooldown,
        errors,
        messages,
        name,
        encumbrance,
        strength,
        speed,
        gold,
        inventory,
        status
      } = data;
      setGameData(prev => {
        return {
          ...prev,
          cooldown,
          errors,
          messages,
          player: {
            ...prev.player,
            name,
            encumbrance,
            strength,
            speed,
            gold,
            inventory,
            status
          }
        };
      });
    }),
    []
  );

  const move = useCallback(
    requestWrapper(async (direction, nextRoomId = null) => {
      const { data } = await gameService.move(direction);
      const {
        cooldown,
        errors,
        messages,
        room_id,
        title,
        description,
        elevation,
        terrain,
        players,
        items,
        exits
      } = data;
      const [x, y] = parseCoordinates(data.coordinates);
      setGameData(prev => {
        return {
          ...prev,
          cooldown,
          errors,
          messages,
          room: {
            ...prev.room,
            id: room_id,
            title,
            description,
            coordinates: { x, y },
            elevation,
            terrain,
            players,
            items,
            exits
          }
        };
      });
    }),
    []
  );

  // get status

  // pick up treasure

  // drop treasure

  // sell treasure

  // examine

  // name changer

  // pray to shrine

  //  fly

  // dash

  useEffect(() => {
    httpService.setAuthKey(apiKey);
    if (apiKey) checkIn();
  }, [apiKey, checkIn]);

  return {
    gameData,
    isLoading,
    apiError,
    actions: {
      checkPlayerStatus,
      checkIn,
      move
    }
  };
};

export default useGameService;
