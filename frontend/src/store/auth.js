/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getUserFromLocalStorage } from '../utils/authUtils';

const user = getUserFromLocalStorage();

const slice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    currentUser: user,
  },
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    loggedIn(state, { payload: { user } }) {
      state.currentUser = user;
      state.loading = false;
    },
    loggedOut(state) {
      state.currentUser = null;
    },
  },
});

export const { setLoading, loggedIn, loggedOut } = slice.actions;

export default slice.reducer;
