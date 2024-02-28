import keyBy from 'lodash/keyBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { getAllClass, getAllGrade, getAllProgram } from 'src/dataProvider/agent';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  grades: [],
  grade: null,
};

const slice = createSlice({
  name: 'grade',
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
    getGradesSuccess(state, action) {
      state.isLoading = false;
      state.grades = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGradesRedux(params) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await getAllGrade(params);
      dispatch(slice.actions.getGradesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
