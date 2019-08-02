import { initRoomData } from 'config';

const getOppositeOrdinal = o => {
  const opposites = { n: 's', s: 'n', e: 'w', w: 'e' };
  return opposites[o];
};

export const updateMapData = (mapData = {}, serverResponse, lastRoomId, thisRoomId, move) => {
  if (thisRoomId in mapData) {
    // update last room with move
    if (lastRoomId !== thisRoomId) {
      // zero is valid
      if (lastRoomId || lastRoomId === 0) {
        mapData[lastRoomId].exits[move] = thisRoomId;
        mapData[thisRoomId].exits[getOppositeOrdinal(move)] = lastRoomId;
      }
    }
    return { ...mapData };
  } else if (thisRoomId !== null) {
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
      if (lastRoomId || lastRoomId === 0) {
        mapData[lastRoomId].exits[move] = thisRoomId;
        mapData[thisRoomId].exits[getOppositeOrdinal(move)] = lastRoomId;
      }
    }

    return { ...mapData };
  }
};

export const parseUploadedFileData = rawData => {
  const jsonData = JSON.parse(rawData);
  const mapData = {};

  for (const roomId in jsonData) {
    const room = jsonData[roomId];

    const exitsMap = {};
    for (const e in room.exits) {
      const dir = e.toLowerCase();
      if ('nesw'.includes(dir)) {
        const to = room.exits[e];
        if (to === '?') {
          exitsMap[dir] = to;
        } else if (parseInt(to)) {
          exitsMap[dir] = parseInt(to);
        }
      }
    }

    const record = {
      ...initRoomData,
      room_id: room.room_id,
      title: room.title,
      description: room.description,
      exits: exitsMap,
      coordinates: room.coordinates,
      terrain: room.terrain,
      elevation: room.elevation
    };
    mapData[roomId] = record;
  }

  return mapData;
};
