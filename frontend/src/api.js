import axios from 'axios';
import { getAuthTokenFromLocalStorage } from './utils/authUtils';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
});

api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';
api.defaults.headers.patch['Content-Type'] = 'application/json';

api.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${getAuthTokenFromLocalStorage()}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default api;
