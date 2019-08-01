import { initRoomData } from 'config';

const getOppositeOrdinal = o => {
  const opposites = { n: 's', s: 'n', e: 'w', w: 'e' };
  return opposites[o];
};

export const updateMapData = (mapData, serverResponse, lastRoomId, thisRoomId, move) => {
  if (thisRoomId in mapData) {
    // update last room with move
    if (lastRoomId !== thisRoomId) {
      mapData[lastRoomId].exits[move] = thisRoomId;
      mapData[thisRoomId].exits[getOppositeOrdinal(move)] = lastRoomId;
    }
    return { ...mapData };
  } else {
    // add new room record
    const { exits } = serverResponse;
    const exitsMap = {};
    for (const e of exits) {
      exitsMap[e] = '?';
    }
    const room = {
      ...initRoomData,
      room_id: serverResponse.room_id,
      title: serverResponse.title,
      description: serverResponse.description,
      exits: exitsMap,
      coordinates: serverResponse.coordinates,
      terrain: serverResponse.terrain,
      elevation: serverResponse.elevation
    };
    mapData[thisRoomId] = room;
    if (lastRoomId !== thisRoomId) {
      mapData[lastRoomId].exits[move] = thisRoomId;
      mapData[thisRoomId].exits[getOppositeOrdinal(move)] = lastRoomId;
    }
    return { ...mapData };
  }
};
