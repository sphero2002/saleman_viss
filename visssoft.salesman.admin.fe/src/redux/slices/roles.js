import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { getALlRoles } from 'src/dataProvider/agent';

const initialState = {
  isLoading: false,
  error: null,
  roles: [],
  pagging: {},
};

const slice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      console.log('hasError', action.payload);
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET class
    getRolesSuccess(state, action) {
      state.isLoading = false;
      state.roles = action.payload.data.data;
      // console.log(action.payload.data.data);
      // state.pagging = JSON.parse(action.payload.headers['x-pagination']);
    },
  },
});

// Reducer
export default slice.reducer;

//////
export function getRolesRedux(params) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.getRolesSuccess([]));
      }
      dispatch(slice.actions.startLoading());
      const response = await getALlRoles(params);
      dispatch(slice.actions.getRolesSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
