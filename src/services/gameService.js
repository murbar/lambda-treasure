import http from './httpService';

const API_URL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/';

const checkStatus = () => {
  return http.post(API_URL + 'status');
};

const checkIn = () => {
  return http.get(API_URL + 'init');
};

const move = (direction, nextRoomId = null) => {
  const payload = { direction };
  if (nextRoomId) payload['next_room_id'] = nextRoomId;
  return http.post(API_URL + 'move', payload);
};

const examine = name => {
  return http.post(API_URL + 'examine', { name: name });
};

const takeItem = itemName => {
  return http.post(API_URL + 'take', { name: itemName });
};

const dropItem = itemName => {
  return http.post(API_URL + 'drop', { name: itemName });
};

const sellItem = (itemName, confirm = false) => {
  const payload = { name: itemName };
  if (confirm) payload.confirm = 'yes';
  return http.post(API_URL + 'sell', payload);
};

const changeName = newName => {
  return http.post(API_URL + 'change_name', { name: newName });
};

const pray = () => {
  return http.post(API_URL + 'pray');
};

const fly = direction => {
  return http.post(API_URL + 'fly', { direction });
};

const dash = (direction, roomIdsOnPath) => {
  return http.post(API_URL + 'dash', {
    direction,
    num_rooms: roomIdsOnPath.length,
    next_room_ids: roomIdsOnPath.join(',')
  });
};

export default {
  checkStatus,
  checkIn,
  move,
  examine,
  takeItem,
  dropItem,
  sellItem,
  pray,
  changeName,
  fly,
  dash
};
