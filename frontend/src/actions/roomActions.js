import api from '../api';
import {
  setLoading,
  roomFetched,
  participantUpdated,
  videoTokenGenerated,
} from '../store/room';

export const fetchRoom = (roomId, participantId) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .get(`meets/${roomId}`)
    .then(({ data: room }) => {
      dispatch(roomFetched({ room, participantId }));
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const updatePariticipant = (roomId, participantId, data) => async (
  dispatch,
) => {
  dispatch(setLoading(true));

  return api
    .put(`meets/${roomId}/participants/${participantId}`, data)
    .then(({ data: participant }) => {
      dispatch(participantUpdated({ participant }));
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const generateVideoToken = (data) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .post('videos/token', data)
    .then(({ data: { token } }) => {
      dispatch(videoTokenGenerated({ token }));
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};
