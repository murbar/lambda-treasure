export const initServerData = {
  room_id: null,
  title: '',
  description: '',
  players: [],
  items: [],
  exits: [],
  coordinates: '',
  terrain: '',
  elevation: 0,
  name: '',
  encumbrance: 0,
  strength: 0,
  speed: 0,
  gold: 0,
  inventory: [],
  status: [],
  cooldown: 0,
  errors: [],
  messages: [],
  lastMoveDirection: ''
};

export const initGameState = {
  apiKey: null,
  mapData: null,
  serverData: initServerData
};

export const testingMode = true;

export const mockGameData = {
  apiKey: 'Token df3e7b57e28f710d96f2b890f009939647bf0760',
  mapData: null,
  serverData: {
    room_id: 5,
    title: 'Mt. Holloway',
    description: 'You are at the base of a large, looming mountain.',
    players: [],
    items: [],
    exits: ['s', 'e', 'w'],
    coordinates: '(61,59)',
    terrain: 'MOUNTAIN',
    elevation: 1,
    name: '68ɹǝʎɐld',
    encumbrance: 2,
    strength: 11,
    speed: 75,
    gold: 44600,
    inventory: ['well-crafted jacket', 'nice boots'],
    status: [],
    cooldown: 0,
    errors: [],
    messages: []
  }
};

export const initRoomData = {
  room_id: null,
  title: '',
  description: '',
  exits: {},
  coordinates: '',
  terrain: '',
  elevation: 0,
  notes: [],
  label: ''
};
