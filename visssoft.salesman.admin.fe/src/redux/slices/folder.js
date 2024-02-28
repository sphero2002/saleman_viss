import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
// utils
//
import { dispatch } from '../store';
import {
    deleteDocument,
    deleteFolder,
    getAllProgram,
    getAllSubject,
    getAllTypeDocument,
    getFolderByID,
    postCopyDocsToFolder,
    postDocument,
    postFolder,
    updateFolder,
} from 'src/dataProvider/agent';
import { PAGE_SIZE } from 'src/config';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    folder: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },
    storeFolder: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },
    folderUploadDoc: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },

    folderUploadDocToSlotInGeneralFolder: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },

    folderUploadDocToSlot: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },

    folderSaveDocToMyFolder: {
        id: '',
        name: '',
        parentId: 0,
        listFolders: [],
        listDocuments: [],
        pagination: {
            TotalCount: 0,
            PageSize: PAGE_SIZE,
            CurrentPage: 1,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false,
        },
    },

    newDocument: {
        data: [],
        init: {
            typeDocuments: [{ typeDocumentInEachRecord: [] }],
            programs: [],
            subjects: [],
            users: [],
            classes: [],
        },
    },
};

const slice = createSlice({
    name: 'folder',
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

        getFolderSuccess(state, action) {
            console.log('getFolderSuccess', action);
            const { folder, dataName, paging } = action.payload;
            state.isLoading = false;
            state[`${dataName}`] = { ...state[`${dataName}`], ...folder, pagination: { ...paging } };
        },

        createFolderSuccess(state, action) {
            console.log('createFolderSuccess', action);
            state.isLoading = false;
            state.folder.listFolders = [action.payload, ...state.folder.listFolders];
        },
        createStoreFolderSuccess(state, action) {
            console.log('createFolderSuccess', action);
            state.isLoading = false;
            state.storeFolder.listFolders = [action.payload, ...state.storeFolder.listFolders];
        },

        createDocumentInitialSuccess(state, action) {
            console.log('createDocumentInitialSuccess', action);
            const { programs, typeDocuments } = action.payload;
            state.isLoading = false;
            state.newDocument.init = { ...state.newDocument.init, programs, typeDocuments };
        },

        getTypeDocumentBySubjectSuccess(state, action) {
            console.log('getTypeDocumentBySubjectSuccess', action, state.newDocument.init.typeDocuments.length);
            const { typeDocuments, index } = action.payload;
            if (state.newDocument.init.typeDocuments.length === index) {
                state.isLoading = false;
                state.newDocument.init.typeDocuments = [
                    ...state.newDocument.init.typeDocuments,
                    { typeDocumentInEachRecord: typeDocuments },
                ];
            } else {
                state.isLoading = false;
                state.newDocument.init.typeDocuments = state.newDocument.init.typeDocuments.map((item, indexItem) => {
                    if (indexItem !== index) {
                        return item;
                    }
                    return {
                        ...item,
                        typeDocumentInEachRecord: typeDocuments,
                    };
                });
            }
        },

        removeTypeDocumentByIndexSuccess(state, action) {
            const { index } = action.payload;
            state.newDocument.init.typeDocuments = [
                ...state.newDocument.init.typeDocuments.slice(0, index),
                ...state.newDocument.init.typeDocuments.slice(index + 1),
            ];
        },

        deleteDocumentInFolderSuccess(state, action) {
            const { documentID, dataName } = action.payload;
            state.isLoading = false;
            state[`${dataName}`].listDocuments = state[`${dataName}`].listDocuments.filter((item) => item.id !== documentID);
        },
        deleteDocumentInStoreFolderSuccess(state, action) {
            const { documentID } = action.payload;
            state.isLoading = false;
            state.storeFolder.listDocuments = state.storeFolder.listDocuments.filter((item) => item.id !== documentID);
        },

        deleteSubFolderInFolderSuccess(state, action) {
            const { folderID } = action.payload;
            console.log('deleteSubFolderInFolderSuccess', action, folderID);
            state.isLoading = false;
            state.folder.listFolders = state.folder.listFolders.filter((item) => item.id !== folderID);
        },
        deleteSubFolderInStoreFolderSuccess(state, action) {
            const { folderID } = action.payload;
            console.log('deleteSubFolderInFolderSuccess', action, folderID);
            state.isLoading = false;
            state.storeFolder.listFolders = state.storeFolder.listFolders.filter((item) => item.id !== folderID);
        },

        updateSubFolderSuccess(state, action) {
            const { id, params } = action.payload;
            state.isLoading = false;

            state.folder.listFolders = state.folder.listFolders.map((item, indexItem) => {
                if (item.id !== id) {
                    return item;
                }
                return {
                    ...item,
                    ...params,
                };
            });
        },
        updateSubStoreFolderSuccess(state, action) {
            const { id, params } = action.payload;
            state.isLoading = false;

            state.storeFolder.listFolders = state.storeFolder.listFolders.map((item, indexItem) => {
                if (item.id !== id) {
                    return item;
                }
                return {
                    ...item,
                    ...params,
                };
            });
        },

        postCopyDocsToFolderSuccess(state, action) {
            console.log('postCopyDocsToFolderSuccess', action);
            state.isLoading = false;
            state.folder.listDocuments = [...state.folder.listDocuments, action.payload];
        },
        postCopyDocsToStoreFolderSuccess(state, action) {
            console.log('postCopyDocsToFolderSuccess', action);
            state.isLoading = false;
            state.storeFolder.listDocuments = [action.payload, ...state.storeFolder.listDocuments];
        },

        createDocumentSuccess(state, action) {
            const { document } = action.payload;
            state.isLoading = false;
            state.storeFolder.listDocuments = [document, ...state.storeFolder.listDocuments];
        },
        createDocumentInSubjectSuccess(state, action) {
            const { document, dataName } = action.payload;
            console.log('createDocumentInSubjectSuccess', document);
            state.isLoading = false;
            state[dataName].listDocuments = [document, ...state[dataName].listDocuments];
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

export function getFolderRedux(folderId, dataName, paging) {
    return async () => {
        try {
            console.log('getFolderRedux', folderId);
            if ((!folderId && folderId !== 0) || !dataName) {
                return returnMessageError(`Không truy cập được thư mục này`);
            }
            const params = paging
                ? {
                    folderId,
                    ...paging,
                }
                : {
                    folderId,
                    TotalCount: 0,
                    PageSize: PAGE_SIZE,
                    CurrentPage: 1,
                    TotalPages: 0,
                    HasNext: false,
                    HasPrevious: false,
                };
            dispatch(slice.actions.startLoading());
            const response = await getFolderByID(params);
            console.log('getFolderByID', response);
            dispatch(
                slice.actions.getFolderSuccess({
                    folder: response.data.data,
                    dataName,
                    paging: JSON.parse(response.headers['x-pagination']),
                })
            );
        } catch (error) {
            return returnMessageError(`Có lỗi xảy ra`);
        }
    };
}

export function createFolderRedux(payload) {
    return async () => {
        try {
            if (!payload) {
                return returnMessageError('Tạo thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await postFolder(payload);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.createFolderSuccess(response.data.data));
            return returnMessageSuccess('Tạo thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function createStoreFolderRedux(payload) {
    return async () => {
        try {
            if (!payload) {
                return returnMessageError('Tạo thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await postFolder(payload);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.createStoreFolderSuccess(response.data.data));
            return returnMessageSuccess('Tạo thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function getTypeDocumentBySubjectRedux(subjectId, index) {
    return async () => {
        try {
            dispatch(slice.actions.startLoading());
            const params = {
                pageIndex: 1,
                pageSize: 100,
                subjectId,
            };
            const response = await getAllTypeDocument(params);
            dispatch(
                slice.actions.getTypeDocumentBySubjectSuccess({
                    typeDocuments: response.data.data,
                    index: index,
                })
            );
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function removeTypeDocumentByIndexRedux(index) {
    return async () => {
        try {
            dispatch(slice.actions.startLoading());
            dispatch(
                slice.actions.removeTypeDocumentByIndexSuccess({
                    index: index,
                })
            );
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function createDocumentInitialRedux() {
    return async () => {
        try {
            dispatch(slice.actions.startLoading());
            const params = {
                pageIndex: 1,
                pageSize: 100,
            };
            const response = await Promise.all([getAllProgram(params), getAllTypeDocument(params)]);
            dispatch(
                slice.actions.createDocumentInitialSuccess({
                    programs: response[0].data.data,
                    typeDocuments: response[1].data.data,
                })
            );
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function deleteDocumentInFolderRedux(documentID, dataName) {
    return async () => {
        try {
            if (!documentID) {
                return returnMessageError('');
            }
            dispatch(slice.actions.startLoading());
            const response = await deleteDocument(documentID);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.deleteDocumentInFolderSuccess({ documentID, dataName }));

            return returnMessageSuccess('');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function deleteDocumentInStoreFolderRedux(documentID) {
    return async () => {
        try {
            if (!documentID) {
                return returnMessageError('');
            }
            dispatch(slice.actions.startLoading());
            const response = await deleteDocument(documentID);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.deleteDocumentInStoreFolderSuccess({ documentID }));

            return returnMessageSuccess('');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function deleteSubFolderInFolderRedux(folderID) {
    return async () => {
        try {
            if (!folderID) {
                return returnMessageError('Xóa thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await deleteFolder(folderID);
            console.log('deleteSubFolderInFolderRedux', response);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.deleteSubFolderInFolderSuccess({ folderID }));

            return returnMessageSuccess('Xóa thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function deleteSubFolderInStoreFolderRedux(folderID) {
    return async () => {
        try {
            if (!folderID) {
                return returnMessageError('Xóa thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await deleteFolder(folderID);
            console.log('deleteSubFolderInFolderRedux', response);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.deleteSubFolderInStoreFolderSuccess({ folderID }));

            return returnMessageSuccess('Xóa thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function updateSubFolderRedux(id, params) {
    return async () => {
        try {
            if (!id || !params) {
                return returnMessageError('Cập nhật thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await updateFolder(id, params);
            console.log('updateFolderRedux', response);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.updateSubFolderSuccess({ id, params }));

            return returnMessageSuccess('Cập nhật thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
        }
    };
}

export function updateSubStoreFolderRedux(id, params) {
    return async () => {
        try {
            if (!id || !params) {
                return returnMessageError('Cập nhật thư mục không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await updateFolder(id, params);
            console.log('updateFolderRedux', response);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }

            dispatch(slice.actions.updateSubStoreFolderSuccess({ id, params }));

            return returnMessageSuccess('Cập nhật thư mục thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError(`${error.message}`);
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

export function copyDocsToStoreFolderRedux(folderId, docsId) {
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

            dispatch(slice.actions.postCopyDocsToStoreFolderSuccess(response.data.data));
            return returnMessageSuccess('Thêm tài liệu thành công');
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function createDocumentRedux(data) {
    return async () => {
        try {
            if (!data.file) {
                return returnMessageError(`Tạo tài liệu${data.code} thất bại`);
            }
            console.log('data', data);

            const responsePostDocument = await postDocument(data);
            if (responsePostDocument instanceof Error) {
                return returnMessageError(`${responsePostDocument.response.data.title}`);
            }
            dispatch(slice.actions.createDocumentSuccess({ document: responsePostDocument.data.data }));
            return returnMessageSuccess(`Tạo tài liệu${data.code} thành công`);
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function createDocumentInSubjectRedux(data, dataName) {
    return async () => {
        try {
            if (!data.file) {
                return returnMessageError(`Tạo tài liệu${data.code} thất bại`);
            }
            console.log('data', data);

            const responsePostDocument = await postDocument(data);
            console.log('createDocumentInSubjectRedux', responsePostDocument);
            if (responsePostDocument instanceof Error) {
                return returnMessageError(`${responsePostDocument.response.data.title}`);
            }
            dispatch(slice.actions.createDocumentInSubjectSuccess({ document: responsePostDocument.data.data, dataName }));
            return {
                title: `Tạo tài liệu${data.code} thành công`,
                documentId: responsePostDocument.data.data.id,
                variant: '',
            };
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}
