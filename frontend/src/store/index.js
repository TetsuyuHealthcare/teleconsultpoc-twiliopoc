import { configureStore, combineReducers } from '@reduxjs/toolkit';

import error from './error';
import auth from './auth';
import meet from './meet';
import room from './room';

const reducer = combineReducers({
  error,
  auth,
  meet,
  room,
});

const store = configureStore({
  reducer,
});

export default store;
