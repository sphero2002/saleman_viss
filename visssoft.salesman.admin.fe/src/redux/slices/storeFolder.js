import { createSlice } from '@reduxjs/toolkit';
// utils
//
import { dispatch } from '../store';
import {
  getAllProgram,
  getAllSubject,
  getAllTypeDocument,
  getFolderByID,
  getStoreFolder,
  postCopyDocsToFolder,
  postDocument,
  postFolder,
} from 'src/dataProvider/agent';
import { AxiosError } from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  storeFolder: {
    id: '',
    name: '',
    parentId: 0,
    listFolders: [],
    listDocuments: [],
  },
  newDocument: {
    data: {
      code: '',
      name: '',
      description: '',
      file: '',
      programId: '',
      subjectId: '',
      typeDocumentId: '',
      urlDocument: '',
      size: 0,
      TypeFile: '',
      status: 0,
      folderId: 1,
      shareUser: [],
      shareClass: [],
    },
    init: {
      typeDocuments: [],
      programs: [],
      subjects: [],
      users: [],
      classes: [],
    },
  },
  history: {
    storeFolder: {
      id: '',
    },
  },
};

const slice = createSlice({
  name: 'storeFolder',
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

    getStoreFolderSuccess(state, action) {
      console.log('getStoreFolderSuccess', action);
      state.isLoading = false;
      state.history.storeFolder = { ...state.history.storeFolder, ...state.storeFolder };
      state.storeFolder = { ...state.storeFolder, ...action.payload };
    },

    getStoreFolderRootSuccess(state, action) {
      state.isLoading = false;
      state.storeFolder = { ...state.storeFolder, ...action.payload };
    },

    createStoreFolderSuccess(state, action) {
      console.log('createStoreFolderSuccess', action);
      state.isLoading = false;
      state.storeFolder.listFolders = [...state.storeFolder.listFolders, action.payload];
    },

    createStoreDocumentInitialSuccess(state, action) {
      console.log('createStoreDocumentInitialSuccess', action);
      const { programs, subjects, typeDocuments, folderId } = action.payload;
      state.isLoading = false;
      state.newDocument.init = { ...state.newDocument.init, ...action.payload };
      state.newDocument.data = {
        ...state.newDocument.data,
        programId: programs[0].id,
        subjectId: subjects[0].id,
        typeDocumentId: typeDocuments[0].id,
        folderId: folderId,
      };
    },

    removeErrorSuccess(state, action) {
      state.error = action.payload;
    },

    postCopyDocsToFolderSuccess(state, action) {
      console.log('postCopyDocsToFolderSuccess', action);
      state.isLoading = false;
      state.storeFolder.listDocuments = [...state.storeFolder.listDocuments, action.payload];
    },
  },
});

// Reducer
export default slice.reducer;

const returnMessageSuccess = (title) => ({
  title: `${title}`,
  variant: '',
});

const returnMessageError = (title) => ({
  title: `${title}`,
  variant: 'error',
});

export function getStoreFolderRedux(params) {
  return async () => {
    try {
      if (!params) {
        return dispatch(slice.actions.hasError());
      }
      dispatch(slice.actions.startLoading());
      const response = await getFolderByID(params);
      console.log('getFolderByID', response);
      dispatch(slice.actions.getStoreFolderSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getStoreFolderRootRedux() {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await getStoreFolder();
      console.log('getStoreFolder', response);
      dispatch(slice.actions.getStoreFolderRootSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createStoreFolderRedux(payload) {
  return async () => {
    try {
      if (!payload) {
        return dispatch(slice.actions.hasError());
      }
      dispatch(slice.actions.startLoading());
      const response = await postFolder(payload);
      console.log('postFolder', response, response instanceof Error);
      if (response instanceof Error) {
        return returnMessageSuccess(response.response.data.title);
      }
      dispatch(slice.actions.createStoreFolderSuccess(response.data.data));
      return returnMessageSuccess('Tạo thư mục thành công');
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function createStoreDocumentInitialRedux(folderId) {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      const params = {
        pageIndex: 1,
        pageSize: 100,
      };
      const response = await Promise.all([getAllProgram(params), getAllSubject(params), getAllTypeDocument(params)]);
      dispatch(
        slice.actions.createStoreDocumentInitialSuccess({
          programs: response[0].data.data,
          subjects: response[1].data.data,
          typeDocuments: response[2].data,
          folderId,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function uploadStoreDocumentRedux(data) {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await postDocument(data);
      if (response.status < 400) {
        console.log('uploadStoreDocumentRedux', response);
      } else {
        console.log('Lỗi upload tài liệu', response.data.title);
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function copyDocsToFolderRedux(folderId, docsId) {
  return async () => {
    try {
      if (!folderId || !docsId) {
        return returnMessageError('Thêm tài liệu thất bại ');
      }
      dispatch(slice.actions.startLoading());
      const response = await postCopyDocsToFolder(folderId, docsId);
      if (response instanceof Error) {
        return returnMessageError(`${response.response.data.title}`);
      }

      dispatch(slice.actions.postCopyDocsToFolderSuccess(response.data.data));
      return returnMessageSuccess('Thêm tài liệu thành công');
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function removeError(mess) {
  return async () => {
    try {
      dispatch(slice.actions.removeErrorSuccess(mess));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
