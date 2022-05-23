import { set, clear } from '../store/error';

export const setErrors = (scope, errors) => async (dispatch) => {
  dispatch(set({ scope, errors }));
};

export const clearErrors = (scope) => async (dispatch) => {
  dispatch(clear({ scope }));
};
