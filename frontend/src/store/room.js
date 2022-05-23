/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'room',
  initialState: {
    loading: false,
    currentRoom: null,
    currentParticipant: null,
    currentVideoToken: null,
  },
  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    roomFetched(state, { payload: { room, participantId } }) {
      state.currentRoom = room;
      state.currentParticipant = room.participants.find(
        (p) => p.id === participantId,
      );
    },
    participantUpdated(state, { payload: { participant } }) {
      const room = state.currentRoom;
      room.participants = room.participants.map((p) =>
        p.id === participant.id ? participant : p,
      );
      state.currentRoom = room;
      state.currentParticipant = participant;
    },
    videoTokenGenerated(state, { payload: { token } }) {
      state.currentVideoToken = token;
    },
  },
});

export const {
  setLoading,
  roomFetched,
  participantUpdated,
  videoTokenGenerated,
} = slice.actions;

export default slice.reducer;
