import http from './httpService';

const API_URL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/';

const checkIn = () => {
  return http.get(API_URL + 'init');
};

const move = direction => {
  return http.post(API_URL + 'move', { direction });
};

export default {
  checkIn,
  move
};
