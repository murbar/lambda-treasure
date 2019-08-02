import { useState, useEffect, useCallback } from 'react';
import gameService from 'services/gameService';
import httpService from 'services/httpService';
import { testingMode } from 'config';

const useGameService = (apiKey, initServerData) => {
  const [gameServerData, setGameServerData] = useState(initServerData);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const requestWrapper = cb => async (...args) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await cb(...args);
      setIsLoading(false);
    } catch (error) {
      const { data, status } = error.response;
      const { message } = error;

      if (data && 'cooldown' in data) {
        setGameServerData(prev => ({ ...prev, cooldown: data.cooldown }));
      }

      if (status === 500) {
        setApiError({ errors: ['Server error, check the console.'] });
      } else if (data) {
        setApiError(data);
      } else if (message) {
        setApiError({ errors: [message] });
      }
      setIsLoading(false);
    }
  };

  // init AND check status to get all game data
  const refresh = useCallback(
    requestWrapper(async () => {
      const { data } = await gameService.checkIn();
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));

      setTimeout(async () => {
        const { data } = await gameService.checkStatus();
        setGameServerData(prev => ({
          ...prev,
          ...data
        }));
      }, data.cooldown * 1000 + 10);
    }),
    []
  );

  const checkRoomStatus = useCallback(
    requestWrapper(async () => {
      const { data } = await gameService.checkIn();
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

  const checkPlayerStatus = useCallback(
    requestWrapper(async () => {
      const { data } = await gameService.checkStatus();
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

  const move = useCallback(
    requestWrapper(async (direction, nextRoomId = null) => {
      const { data } = await gameService.move(direction, nextRoomId);
      setGameServerData(prev => ({
        ...prev,
        ...data,
        lastMoveDirection: direction
      }));
    }),
    []
  );

  const takeItem = useCallback(
    requestWrapper(async itemName => {
      const { data } = await gameService.takeItem(itemName);
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

  const dropItem = useCallback(
    requestWrapper(async itemName => {
      const { data } = await gameService.dropItem(itemName);
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

  const sellItem = useCallback(
    requestWrapper(async itemName => {
      const { data } = await gameService.sellItem(itemName, true);
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

  const examineItem = useCallback(
    requestWrapper(async itemName => {
      const { data } = await gameService.examine(itemName);
      console.log(data);
      // handle special data shape
      setGameServerData(prev => ({
        ...prev,
        ...data
      }));
    }),
    []
  );

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
    if (apiKey && !testingMode) refresh();
  }, [apiKey, refresh]);

  return {
    gameServerData,
    isLoading,
    apiError,
    actions: {
      refresh,
      checkPlayerStatus,
      checkRoomStatus,
      move,
      takeItem,
      dropItem,
      sellItem,
      examineItem
    }
  };
};

export default useGameService;
