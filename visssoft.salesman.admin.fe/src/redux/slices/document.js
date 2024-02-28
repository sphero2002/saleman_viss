import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import {
    addShareDoc,
    getAllProgram,
    getAllSubject,
    getAllTypeDocument,
    getDocumentById,
    getFolderByID,
    getLocalStorage,
    getProgramById,
    getSubjectById,
    getUserById,
    postDocument,
    postFile,
    postFolder,
    updateShareDocs,
} from 'src/dataProvider/agent';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    getOne: {
        id: 0,
        typeDocumentId: 0,
        subjectId: 0,
        programId: 0,
        code: '',
        name: '',
        link: null,
        description: '',
        size: 0,
        typeFile: '',
        urlDocument: '',
        viewNumber: 0,
        downloadNumber: 0,
        permissaction: 0,
        status: 0,
        listShare: [],
        initShare: [],
    },
};

const slice = createSlice({
    name: 'document',
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

        getOneDocumentSuccess(state, action) {
            console.log('getOneDocumentSuccess', action);
            state.isLoading = false;
            state.getOne = { ...state.getOne, ...action.payload };
        },

        handleSearchUserSuccess(state, action) {
            console.log('handleSearchUserSuccess', action);
            state.isLoading = false;
            state.getOne.initShare = [{ user: action.payload, permission: 0 }];
        },

        handleSendInviteSuccess(state, action) {
            console.log('handleSendInviteSuccess', action);
            state.isLoading = false;
            state.getOne.listShare = [
                ...state.getOne.listShare,
                { user: action.payload[0].user, permission: action.payload[0].permission },
            ];
        },
        handleChangePermissionSuccess(state, action) {
            const { user, permission } = action.payload[0];
            console.log('handleChangePermissionSuccess', user, permission, action.payload.index);
            state.isLoading = false;
            // delete user in list share if permission ==2
            if (permission === 2) {
                state.getOne.listShare = [
                    ...state.getOne.listShare.slice(0, action.payload.index),
                    ...state.getOne.listShare.slice(action.payload.index + 1),
                ];
            } else {
                state.getOne.listShare = [
                    ...state.getOne.listShare.slice(0, action.payload.index),
                    { user, permission },
                    ...state.getOne.listShare.slice(action.payload.index + 1),
                ];
            }
            // state.getOne.listShare.map((item, indexListShare) => {
            //   if (action.payload.index !== indexListShare) {
            //     // This isn't the item we care about - keep it as-is
            //     return item;
            //   }

            //   // Otherwise, this is the one we want - return an updated value
            //   return {
            //     ...item,
            //     user,
            //     permission,
            //   };
            // });
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

export function getOneDocumentRedux(id) {
    return async () => {
        try {
            if (!id) {
                return returnMessageError('Truy cập thư mục bị lỗi!');
            }
            dispatch(slice.actions.startLoading());
            const response = await getDocumentById(id);
            console.log('getOneDocumentRedux', response);
            if (response instanceof Error) {
                return returnMessageError(`${response.response.data.title}`);
            }
            const document = response.data.data;
            // const detailProgramAndSubject = await Promise.all([
            //   getProgramById(document.programId),
            //   getSubjectById(document.subjectId),
            // ]);
            dispatch(
                slice.actions.getOneDocumentSuccess({
                    ...document,
                    // programDetail: detailProgramAndSubject[0].data.data,
                    // subjectDetail: detailProgramAndSubject[1].data.data,
                })
            );
            return returnMessageSuccess('Truy cập thành công');
        } catch (error) {
            console.log('error', error);
            return returnMessageError('Truy cập thư mục bị lỗi!');
        }
    };
}

export function handleSearchUserRedux(user) {
    return async () => {
        try {
            if (!user) {
                return;
            }
            dispatch(slice.actions.startLoading());
            dispatch(slice.actions.handleSearchUserSuccess(user));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function handleSendInviteRedux(getOne) {
    return async () => {
        try {
            if (!getOne) {
                return returnMessageError('Thư mục không tồn tại');
            }
            dispatch(slice.actions.startLoading());
            const response = await addShareDoc(getOne.id, getOne.permissaction, getOne.initShare);
            console.log('handleSendInviteRedux', response);
            dispatch(slice.actions.handleSendInviteSuccess(response.data.data));
            return returnMessageSuccess('Chia sẻ tài liệu thành công');
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function handleChangePermissionRedux(getOne, user, index, permission) {
    return async () => {
        try {
            console.log('handleChangePermissionRedux', getOne, user, index, permission);
            if (!getOne) {
                return returnMessageError('Đổi quyền không thành công');
            }
            dispatch(slice.actions.startLoading());
            const response = await updateShareDocs(getOne.id, [{ user, permission }]);
            dispatch(slice.actions.handleChangePermissionSuccess({ ...response.data.data, index }));
            return returnMessageSuccess('Đổi quyền thành công');
        } catch (error) {
            return returnMessageError(`${error.message}`);
        }
    };
}

export function startDownloadFileRedux(file, url) {
    return async () => {
        if (!file || !url) {
            return;
        }
        console.log('startDownloadFileRedux', file, url);
        try {
            const params = {
                fileName: file.urlDocument,
                contentType: file.typeFile,
            };
            const token = getLocalStorage('access_token');
            axios({
                url: `${url}fileName=${params.fileName}&contentType=${params.contentType}`, //your url
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                if (response.status < 400) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', params.fileName); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                    return returnMessageSuccess('Tải tài liệu thành công ');
                } else {
                    return returnMessageError('Tài liệu không tồn tại');
                }
            });
        } catch (error) {
            console.log('error', error);
            return returnMessageError(error.message);
        }
    };
}
