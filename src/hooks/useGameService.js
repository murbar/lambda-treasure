import { useState, useEffect, useCallback } from 'react';
import gameService from 'services/gameService';
import httpService from 'services/httpService';

const useGameService = apiKey => {
  const [roomData, setRoomData] = useState(null);
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
      setRoomData(data);
    }),
    []
  );

  const move = useCallback(
    requestWrapper(async direction => {
      const { data } = await gameService.move(direction);
      setRoomData(data);
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
    roomData,
    isLoading,
    apiError,
    checkIn,
    move
  };
};

export default useGameService;
