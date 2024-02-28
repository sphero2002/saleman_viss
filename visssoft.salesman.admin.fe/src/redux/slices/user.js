import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { getAllUsers, getAllUsersWithInfo } from 'src/dataProvider/agent';

const initialState = {
  isLoading: false,
  error: null,
  addUserInCLass: [
    {
      users: [],
      subjects: [],
      roles: [],
      pagination: {
        pageIndex: 1,
        pageSize: 100,
        roleId: '',
        userId: '',
      },
    },
  ],
  paginationHeader: {},
};

const slice = createSlice({
  name: 'user',
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
    getUserSuccess(state, action) {
      console.log('getUserSuccess: ', action);
      const { response, index, pagination } = action.payload;
      state.isLoading = false;
      state.paginationHeader = JSON.parse(response.headers['x-pagination']);
      state.addUserInCLass = state.addUserInCLass.map((item, indexItem) => {
        if (indexItem !== index) {
          return item;
        }
        return {
          ...item,
          users: response.data.data,
          roles: response.data.data.roles,
          subjects: response.data.data.subjects,
          pagination,
        };
      });
    },
    getAllUsersWithInfoSuccess(state, action) {
      console.log('getAllUsersWithInfoSuccess: ', action);
      const { response, index, pagination } = action.payload;
      state.isLoading = false;
      state.paginationHeader = JSON.parse(response.headers['x-pagination']);
      state.addUserInCLass = state.addUserInCLass.map((item, indexItem) => {
        if (indexItem !== index) {
          return item;
        }
        return {
          ...item,
          users: response.data.data,
          roles: response.data.data.roles,
          subjects: response.data.data.subjects,
          pagination,
        };
      });
    },

    getUserByRoleIdSuccess(state, action) {
      const { users, pagination, index } = action.payload;
      console.log('getUserByRoleIdSuccess', index);
      state.isLoading = false;
      // state.users = users;
      // state.pagination = pagination;

      state.addUserInCLass = state.addUserInCLass.map((item, indexItem) => {
        if (indexItem !== index) {
          return item;
        }
        return {
          ...item,
          users,
          pagination,
        };
      });
    },
    filterSubjectSuccess(state, action) {
      console.log('filterSubjectSuccess', action);
      const { user, index } = action.payload;
      if (!user.subjects) {
        return;
      }
      const userTransfer = user.subjects.map((data) => {
        return { id: data.id, label: data.name };
      });
      state.isLoading = false;
      state.addUserInCLass = state.addUserInCLass.map((item, indexItem) => {
        if (indexItem !== index) {
          return item;
        }
        return {
          ...item,
          subjects: userTransfer,
          roles: user.roles,
        };
      });
      // state.addUserInCLass = [
      //   ...state.addUserInCLass.slice(0, index),
      //   { users, pagination },
      //   ...state.addUserInCLass.slice(index + 1),
      // ];
      // state.subjects = [...state.subjects.slice(0, index), userTransfer, ...state.subjects.slice(index + 1)];
    },

    deleteAddUserInCLassSuccess(state, action) {
      const { index } = action.payload;
      state.isLoading = false;
      state.addUserInCLass = state.addUserInCLass.filter((item, indexItem) => indexItem !== index);
    },

    createAddUserInCLassSuccess(state, action) {
      console.log('createAddUserInCLassSuccess');
      state.isLoading = false;
      state.addUserInCLass = [
        ...state.addUserInCLass,
        {
          users: [],
          subjects: [],
          pagination: {
            pageIndex: 1,
            pageSize: 100,
            roleId: '',
            userId: '',
          },
        },
      ];
    },
  },
});

// Reducer
export default slice.reducer;

const returnMessageSuccess = (title) => ({
  title: `${title}`,
  variant: 'success',
});

const returnMessageError = (title) => ({
  title: `${title}`,
  variant: 'error',
});

//////
export function getUsersRedux(params, index) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.getUserSuccess([]));
      }
      dispatch(slice.actions.startLoading());
      const response = await getAllUsers(params);
      // console.log("test redux: ", )
      dispatch(
        slice.actions.getUserSuccess({
          pagination: params,
          response: response,
          index,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAllUsersWithInfoRedux(params, index) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.getUserSuccess([]));
      }
      dispatch(slice.actions.startLoading());
      const response = await getAllUsersWithInfo(params);
      // console.log("test redux: ", )
      dispatch(
        slice.actions.getAllUsersWithInfoSuccess({
          pagination: params,
          response: response,
          index,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getUsersByRoleIdRedux(params, index) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.hasError('Không có params'));
      }
      dispatch(slice.actions.startLoading());
      const response = await getAllUsers(params);
      console.log('getUsersByRoleIdRedux', response);
      dispatch(
        slice.actions.getUserByRoleIdSuccess({
          users: response.data.data,
          pagination: params,
          index,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteAddUserInCLassRedux(index) {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      dispatch(slice.actions.deleteAddUserInCLassSuccess({ index }));
      return returnMessageSuccess('Thêm người dùng vào lớp học thành công');
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function filterSubjectRedux(params) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.hasError('Không có userId'));
      }
      dispatch(slice.actions.startLoading());
      dispatch(slice.actions.filterSubjectSuccess(params));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createAddUserInCLassRedux() {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      dispatch(slice.actions.createAddUserInCLassSuccess());
      return returnMessageSuccess('Thêm người dùng vào lớp học thành công');
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}
