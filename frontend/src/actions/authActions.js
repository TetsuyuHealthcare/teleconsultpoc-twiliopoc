import api from '../api';
import {
  setUserToLocalStorage,
  removeUserFromLocalStorage,
} from '../utils/authUtils';
import { setLoading, loggedIn, loggedOut } from '../store/auth';
import { setErrors, clearErrors } from './errorActions';

export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .post('/auth/login', credentials)
    .then(({ data: user }) => {
      setUserToLocalStorage(user);
      dispatch(clearErrors('login'));
      dispatch(loggedIn({ user }));
    })
    .catch((error) => {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(setErrors('login', { 'Email or password': ['is invalid'] }));
      }
      throw error;
    });
};

export const logout = () => async (dispatch) => {
  removeUserFromLocalStorage();
  dispatch(loggedOut());
};
