import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
// utils
//
import { dispatch } from '../store';
import {
  deleteDocument,
  deleteDocumentInSubject,
  deleteFolder,
  getAllProgram,
  getAllSubject,
  getAllTypeDocument,
  getDocInClass,
  getFolderByID,
  getSubjectById,
  postCopyDocsToFolder,
  postDocument,
  postDocumentsInSlot,
  postFolder,
  updateFolder,
} from 'src/dataProvider/agent';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  subject: {
    id: 0,
    code: '',
    name: '',
    description: '',
    listSlots: [],
  },
  documentInClass: [],
};

const slice = createSlice({
  name: 'subject',
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
    getSubjectSuccess(state, action) {
      const { subject } = action.payload;
      state.isLoading = false;
      state.subject = { ...subject };
    },
    getDocumentInClassSuccess(state, action) {
      const { document } = action.payload;
      state.isLoading = false;
      state.documentInClass = [...document];
    },

    postDocumentsInSlotSuccess(state, action) {
      const { document } = action.payload;
      state.isLoading = false;
      state.documentInClass = [...state.documentInClass, document];
    },
    deleteDocumentInSubjectSuccess(state, action) {
      const { index } = action.payload;
      state.isLoading = false;
      state.documentInClass = [...state.documentInClass.slice(0, index), ...state.documentInClass.slice(index + 1)];
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

export function getSubjectRedux(subjectID) {
  return async () => {
    try {
      if (!subjectID && subjectID !== 0) {
        return returnMessageError(``);
      }
      dispatch(slice.actions.startLoading());
      const response = await getSubjectById(subjectID);
      if (response instanceof Error) {
        return returnMessageError(`${response.response.data.title}`);
      }
      dispatch(slice.actions.getSubjectSuccess({ subject: response.data.data }));
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function getDocumentInClassRedux(classID, subjectID) {
  return async () => {
    try {
      console.log('getDocumentInClassRedux', classID, subjectID);
      if (_.isNaN(classID) || _.isNaN(subjectID)) {
        return returnMessageError(``);
      }
      dispatch(slice.actions.startLoading());
      const response = await getDocInClass({
        classId: classID,
        subjectId: subjectID,
      });
      if (response instanceof Error) {
        return returnMessageError(`${response.response.data.title}`);
      }
      dispatch(slice.actions.getDocumentInClassSuccess({ document: response.data.data }));
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function postDocumentsInSlotRedux(classId, documentId, slotId, subjectId) {
  return async () => {
    try {
      if (_.isNaN(classId) || _.isNaN(documentId) || _.isNaN(slotId) || _.isNaN(subjectId)) {
        return returnMessageError(`truyền params sai`);
      }
      dispatch(slice.actions.startLoading());

      const response = await postDocumentsInSlot(classId, documentId, slotId, subjectId);

      if (response instanceof Error) {
        return returnMessageError(`${response.response.data.title}`);
      }
      dispatch(slice.actions.postDocumentsInSlotSuccess({ document: response.data.data }));
      return returnMessageSuccess('Thêm tài liệu thành công');
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}

export function deleteDocumentInSubjectRedux(params) {
  return async () => {
    try {
      if (_.isEmpty(params)) {
        return returnMessageError(`truyền params sai`);
      }
      dispatch(slice.actions.startLoading());

      const response = await deleteDocumentInSubject(params);

      if (response instanceof Error) {
        return returnMessageError(`${response.response.data.title}`);
      }
      dispatch(slice.actions.deleteDocumentInSubjectSuccess({ index: params.index }));
    } catch (error) {
      return returnMessageError(`${error.message}`);
    }
  };
}
