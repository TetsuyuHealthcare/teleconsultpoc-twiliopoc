/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'error',
  initialState: {},
  reducers: {
    set(state, { payload: { scope, errors } }) {
      state[scope] = errors;
    },
    clear(state, { payload: { scope } }) {
      if (Array.isArray(scope)) {
        scope.forEach((sp) => {
          state[sp] = null;
        });
      } else {
        state[scope] = null;
      }
    },
  },
});

export const { set, clear } = slice.actions;

export default slice.reducer;
