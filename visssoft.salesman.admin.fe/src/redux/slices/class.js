import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { getAllClass, getClassById } from 'src/dataProvider/agent';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  classes: [],
  pagging: {},
  classObj: {
    code: '',
    name: '',
    size: '',
    schoolYear: '',
    userClass: [],
    teachers: [],
    students: [],
    gradeId: '',
    grade: {},
    programId: '',
    program: {},
  },
  steps:{
    activeStep: 0,
  }
};

const slice = createSlice({
  name: 'class',
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
    getClassesSuccess(state, action) {
      state.isLoading = false;
      state.classes = action.payload.data.data;
      state.pagging = JSON.parse(action.payload.headers['x-pagination']);
    },

    getClassSuccess(state, action) {
      state.isLoading = false;
      console.log('getClassSuccess', action.payload);
        const teachers = action.payload.member.filter((obj) => obj.role === 'GVCHUNHIEM' || obj.role === 'TRUONGBOMON');
      const students = action.payload.member.filter((obj) => obj.role === 'HOCSINH');
      state.classObj = { ...state.classObj, ...action.payload, teachers, students };
      console.log('getClassSuccess', state.classObj);
    },

    resetAddClass(state) {
      state.steps.activeStep = 0;
    },

    backStep(state) {
      state.steps.activeStep -= 1;
    },

    nextStep(state) {
      state.steps.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.steps.activeStep = step;
    },

  },
});

// Reducer
export default slice.reducer;

export const {
  resetAddClass,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions;

// ----------------------------------------------------------------------

export function getClassesRedux(params) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.getClassesSuccess([]));
      }
      dispatch(slice.actions.startLoading());
      const response = await getAllClass(params);
      dispatch(slice.actions.getClassesSuccess(response));
      // dispatch(slice.actions.getPagging(response.headers['x-pagination']));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getClassRedux(params) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.hasError());
      }
      dispatch(slice.actions.startLoading());
      const response = await getClassById(params);
      dispatch(slice.actions.getClassSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
