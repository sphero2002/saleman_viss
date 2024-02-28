import keyBy from 'lodash/keyBy';
import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    data: {}
};

const slice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // CREATE NEW COLUMN
        setData(state = initialState, action) {
            return { ...state, data: action.payload };
        },

    },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function createData(newValue) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            dispatch(
                slice.actions.setData(newValue)
            );
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
