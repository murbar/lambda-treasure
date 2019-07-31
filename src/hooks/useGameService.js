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
      console.dir(error);
      const { data } = error.response;
      if (data) {
        setApiError(error.response.data.errors[0]);
      } else {
        setApiError(error.message);
      }
      setIsLoading(false);
    }
  };

  const checkIn = useCallback(
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
        ...data
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
    if (apiKey && !testingMode) checkIn();
  }, [apiKey, checkIn]);

  return {
    gameServerData,
    isLoading,
    apiError,
    actions: {
      checkPlayerStatus,
      checkIn,
      move,
      takeItem,
      dropItem,
      sellItem
    }
  };
};

export default useGameService;
