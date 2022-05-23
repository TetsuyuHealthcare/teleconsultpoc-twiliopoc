import api from '../api';
import { setLoading, meetsFetched } from '../store/meet';
import { setErrors, clearErrors } from './errorActions';

export const fetchMeets = ({ page, limit }) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .get('/meets', { params: { page, limit } })
    .then(
      ({
        data: {
          items,
          meta: { currentPage, totalItems, itemsPerPage },
        },
      }) => {
        dispatch(
          meetsFetched({
            items,
            page: currentPage,
            limit: itemsPerPage,
            totalCount: totalItems,
          }),
        );
      },
    )
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const createMeet = (data) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .post('/meets', data)
    .then(() => {
      dispatch(clearErrors('createMeet'));
    })
    .catch((error) => {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(setErrors('createMeet', { 'Submitted data': ['is invalid'] }));
      }
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const updateMeet = (id, data) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .put(`/meets/${id}`, data)
    .then(() => {
      dispatch(clearErrors('updateMeet'));
    })
    .catch((error) => {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(setErrors('updateMeet', { 'Submitted data': ['is invalid'] }));
      }
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};

export const deleteMeet = (id) => async (dispatch) => {
  dispatch(setLoading(true));

  return api
    .delete(`/meets/${id}`)
    .then(() => {
      dispatch(clearErrors('deleteMeet'));
    })
    .catch((error) => {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(
          setErrors('deleteMeet', { Deleting: ['is unable to process'] }),
        );
      }
      throw error;
    })
    .finally(() => {
      dispatch(setLoading(false));
    });
};
