export const initServerData = {
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

export const initGameState = {
  apiKey: null,
  mapData: null,
  serverData: initServerData,
  apiError: null
};

export const mockGameData = {
  apiKey: null,
  mapData: null,
  serverData: {
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
  },
  apiError: null
};
export const testingMode = false;
