import keyBy from 'lodash/keyBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import {getAllClass, getAllProgram, getProgramById} from 'src/dataProvider/agent';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  programs: [],
  program: '',
};

const slice = createSlice({
  name: 'program',
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
    getProgramsSuccess(state, action) {
      state.isLoading = false;
      state.programs = action.payload;
    },
    getProgramSuccess(state, action) {
      state.isLoading = false;
      state.program = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProgramsRedux(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getAllProgram(params);
      dispatch(slice.actions.getProgramsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProgramRedux(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getProgramById(id);
      dispatch(slice.actions.getProgramSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
