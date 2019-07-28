import axios from 'axios';

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response && error.response.status >= 400 && error.response.status < 500;

  if (!expectedError) {
    // log error and notify user
    console.error('Unexpected http request error:');
    console.dir(error);
  }

  return Promise.reject(error);
});

function setAuthKey(token) {
  axios.defaults.headers.common['Authorization'] = token;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setAuthKey
};
