/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'meet',
  initialState: {
    page: 1,
    limit: 25,
    items: [],
    totalCount: 0,
    loading: false,
  },
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    meetsFetched(state, { payload: { items, totalCount, page, limit } }) {
      state.page = page;
      state.limit = limit;
      state.items = items;
      state.totalCount = totalCount;
    },
  },
});

export const {
  setLoading,
  meetsFetched,
} = slice.actions;

export default slice.reducer;
