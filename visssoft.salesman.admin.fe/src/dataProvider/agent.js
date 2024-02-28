import axios from 'axios';
//http://vicschool.site:8080/api/ https://localhost:7287/
const instance = axios.create({
    baseURL: process.env.HOST_API_KEY,
    timeout: 60000,
});

import { PATH_AUTH } from '../routes/paths';
import { useRouter } from 'next/router';
import { idID } from '@mui/material/locale';

// INTERCEPTORS CONFIG START
instance.interceptors.response.use(responseOnSuccessMiddleware, responseOnErrorMiddleware);

function responseOnSuccessMiddleware(res) {
    return res;
}

function responseOnErrorMiddleware(error) {
    const { status } = error.response;
    if (status === 401) {
        localStorage.clear();
        window.location.href = PATH_AUTH.login;
    }
    return error;
}

// INTERCEPTORS CONFIG END

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
const getLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(key));
    }
};

const clearLocalStorage = () => {
    localStorage.clear();
};

// GET API AREA ============================>
async function getApiV2(url) {
    const token = getLocalStorage('access_token');
    try {
        const res = await instance.get(url, {
            headers: {
                Authorization: token ? `Bearer ${token}` : 'no auth',
            }
        });
        return res;
    } catch (err) {
        return err;
    }
}

async function getApi(url, params) {
    // delete all params fail
    const paramObj = {};
    if (params && Object.keys(params).length) {
        Object.keys(params).forEach(function (key) {
            if (params[key]) {
                paramObj[key] = params[key];
            }
        });
    }

    const token = getLocalStorage('access_token');
    try {
        const res = await instance.get(url, {
            headers: {
                Authorization: token ? `Bearer ${token}` : 'no auth',
            },
            params: paramObj,
        });
        return res;
    } catch (err) {
        return err;
    }
}
// REPORT
function getReport() {
    return getApi('/Report/getAll');
}

function getAllDocsReport(params) {
    return getApi('/Report/getAllDocuments', params);
}
// PERM NAV MENU
function getMenuItems() {
    return getApi('/Auth/getMenuItems');
}

function getAllMenu(params) {
    return getApi('/Menu/getAll', params);
}
//Menu GetAll
function getAllMenu2(params) {
    return getApiV2('/Menu/getAll?' + params);
}
function getMenuById(id) {
    return getApi(`/Menu/getOne/${id}`);
}
//Menu
const updateMenu = (id, payload) => {
    return putApi(`Menu/${id}`, payload);
};
const createMenu = (payload) => {
    return postApi(`Menu`, payload);
};
const deleteMenu = (id) => {
    return deleteApi(`Menu/${id}`);
};

//class ADMIN
function getAllClass(params) {
    return getApi('/Class/getAll', params);
}

//class USER
function getAllMyClass(params) {
    return getApi('/Class/myClass/getAll', params);
}

function getMyClassGetOne(id) {
    return getApi(`/Class/myClass/getOne/${id}`);
}

function getClassById(id) {
    return getApi(`/Class/getOne/${id}`);
}

// SUBJECT
function getAllSubject(params) {
    return getApi('/Subject/getAll', params);
}

function getSubjectById(id) {
    return getApi(`/Subject/getOne/${id}`);
}

// GRADE
function getAllGrade(params) {
    return getApi(`/Grade/getAll`, params);
}

function getGradeById(id) {
    return getApi(`/Grade/getOne/${id}`);
}

// LEVEL
function getMenu() {
    return getApi(`/Auth/getMenuItems`);
}

// LEVEL
function getAllLevel(params) {
    return getApi(`/Level/getAll`, params);
}

function getLevelById(id) {
    return getApi(`/Level/getOne/${id}`);
}

// USERS
function getAllUsers(params) {
    return getApi('/User/getAll', params);
}
function getAllUsersWithInfo(params) {
    return getApi('/User/getAllUserWithInfor', params);
}

function getUserById(id) {
    return getApi(`/User/getOne/${id}`);
}

// PROGRAM
function getAllProgram(params) {
    return getApi('/Program/getAll', params);
}

function getProgramById(id) {
    return getApi(`/Program/getOne/${id}`);
}

// DOCUMENT
function getAllDocument(params) {
    return getApi('/Document/getAllDocumentsPublic', params);
}

function getDocumentShareWithMe(params) {
    return getApi('Document/getAllMyDocumentsShareWithMe', params);
}

function checkDocCloseOpen(id) {
    return getApi(`/Document/checkDocCloseOpen/${id}`);
}

function getDocumentById(id) {
    return getApi(`/Document/getOne/${id}`);
}

// TYPE DOCUMENT
function getAllTypeDocument(params) {
    return getApi('/TypeDocument/getAll', params);
}

function getTypeDocumentById(id) {
    return getApi(`/TypeDocument/getOne/${id}`);
}
// DOCUMENT IN CLASS
function getDocInClass(params) {
    return getApi('/Document/getDocumentsInClass', params);
}
// SLOT

function getAllSlot(params) {
    return getApi('/Slot/getAll', params);
}

function getSlotById(id) {
    return getApi(`/Slot/getOne/${id}`);
}

// ROLES
function getALlRoles(params) {
    return getApi('/Role/getAll', params);
}

function getRoleById(id) {
    return getApi(`/Role/getOne/${id}`);
}

// Permission
function getAllPermission(params) {
    return getApi('/Permission/getAll', params);
}

// Folder
function getFolderByID(params) {
    return getApi(`/Folder/getOne/${params.folderId}?pageIndex=${params.CurrentPage}&pageSize=${params.PageSize}`);
}
function getFolderTree() {
    return getApi(`/Folder/viewFolderTree`);
}


// FILE
function downloadFile(params) {
    return getApi('/File/downloadFile', { params }, { responseType: 'blob' });
}
function getCommonFiles(id) {
    return getApi(`/File/getCommonFiles/${id}`);
}

function getStoreFolder(params) {
    return getApi('/Folder/getStoreFolder', params);
}

function getPermissionById(id) {
    return getApi(`/Permission/getOne/${id}`);
}

// POST API AREA ============================>
async function postApi(url, payload, file) {
    const token = getLocalStorage('access_token');
    try {
        const res = await instance.post(`/${url}`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : 'no-author',
                'Content-Type': file ? 'multipart/form-data' : 'application/json; charset=utf-8',
                'Access-Control-Allow-Headers':
                    'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Origin': '*',
            },
        });
        return res;
    } catch (err) {
        return err;
    }
}

// LOGIN
const loginAuth = (payload) => {
    return postApi('Auth/login', payload);
};

// CLASS
const postClass = (payload) => {
    return postApi('Class', payload);
};

const postFileExcelAddMember = (id, payload) => {
    return postApi(`Class/UploadExcelAddMember?id=${id}`, payload, 1);
};

const postFileExcelAddSubject = (id, payload) => {
    return postApi(`Class/UploadExcelAddSubject?id=${id}`, payload, 1);
};

// GRADE
const postGrade = () => {
    return postApi('Grade');
};

// LEVEL
const postLevel = () => {
    return postApi('Level');
};

// FILE
const postFile = (payload) => {
    return postApi('File/UploadFile', payload, 1);
};

// Program
const createProgram = (payload) => {
    return postApi('Program', payload);
};

// Level
const createLevel = (payload) => {
    return postApi('Level', payload);
};

// Grade
const createGrade = (payload) => {
    return postApi('Grade', payload);
};

// Subject
const createSubject = (payload) => {
    return postApi('Subject', payload);
};

// Slot
const createSlot = (payload) => {
    return postApi('Slot', payload);
};

// User Auth
const createUserAuth = (payload) => {
    return postApi('Auth/registerSingleUser', payload);
};

const createManyUser = (payload) => {
    return postApi('User/UploadExcel', payload, 1);
};

// ROLE
const createRole = (payload) => {
    return postApi('Role', payload);
};

// Permission
const createPermission = (payload) => {
    return postApi('Permission', payload);
};

// UPLOAD FILE
const uploadFile = (payload) => {
    return postApi('File/uploadFile', payload);
};
// DOCUMENT
const postDocument = (payload) => {
    return postApi('Document', payload);
};

const postDocumentsInSlot = (classId, documentId, slotId, subjectId) => {
    if (slotId) {
        return postApi(
            `Document/addDocumentsInSlot?classId=${classId}&documentId=${documentId}&slotId=${slotId}&subjectId=${subjectId}`
        );
    } else if (slotId === 0) {
        return postApi(`Document/addDocumentsInSlot?classId=${classId}&documentId=${documentId}&subjectId=${subjectId}`);
    }
};

const addShareDoc = (id, permissaction, payload) => {
    return postApi(`Document/addShareDocs?docsId=${id}&permissaction=${permissaction}`, payload);
};
// Folder
const postFolder = (payload) => {
    return postApi('Folder', payload);
};

// TYPE_DOCUMENT
const postTypeDocument = (payload) => {
    return postApi('TypeDocument', payload);
};

// TYPE_DOCUMENT
const postCopyDocsToFolder = (folderId, docsId) => {
    return postApi(`Document/copyDocsToFolder?folderId=${folderId}&docsId=${docsId}`, {});
};

// DELETE API AREA ============================>
async function deleteApi(url) {
    const token = getLocalStorage('access_token');

    try {
        const res = await instance.delete(`/${url}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : 'no-author',
            },
        });
        return res;
    } catch (err) {
        return err;
    }
}

// PROGRAM
const deleteProgram = (id) => {
    return deleteApi(`Program/${id}`);
};
// CLASS
const deleteClass = (id) => {
    return deleteApi(`Class/${id}`);
};
//
// DOCUMENT
const deleteDocument = (id) => {
    return deleteApi(`Document/${id}`);
};

const updateDocument = (id, payload) => {
    return putApi(`Document/${id}`, payload);
};

// USER
const deleteUser = (id) => {
    return deleteApi(`User/${id}`);
};
// LEVEL
const deleteLevel = (id) => {
    return deleteApi(`Level/${id}`);
};

// GRADE
const deleteGrade = (id) => {
    return deleteApi(`Grade/${id}`);
};

// SUBJECT
const deleteSubject = (id) => {
    return deleteApi(`Subject/${id}`);
};

// SLOT
const deleteSlot = (id) => {
    return deleteApi(`Slot/${id}`);
};

// TYPE_DOCUMENT
const deleteTypeDocument = (id) => {
    return deleteApi(`TypeDocument/${id}`);
};

// ROLE
const deleteRole = (id) => {
    return deleteApi(`Role/${id}`);
};

// Permission
const deletePermission = (id) => {
    return deleteApi(`Permission/${id}`);
};

// DOCUMENT
const deleteFolder = (id) => {
    return deleteApi(`Folder/${id}`);
};

// PUT API AREA ============================>
async function putApi(url, payload) {
    const token = getLocalStorage('access_token');
    try {
        const res = await instance.put(`/${url}`, payload, {
            headers: {
                Authorization: token ? `Bearer ${token}` : 'no-author',
            },
        });
        return res;
    } catch (err) {
        return err;
    }
}
// SUBJECT IN CLASS
const deleteSubjectInClass = (id, payload) => {
    return putApi(`Class/removeSubject/${id}`, payload);
};
// MEMBER IN CLASS
const removeMemberInClass = (id, payload) => {
    return putApi(`Class/updateRemoveMember/${id}`, payload);
};
// PROGRAM
const updateProgram = (id, payload) => {
    return putApi(`Program/${id}`, payload);
};

// CLASS
const updateClass = (id, payload) => {
    return putApi(`Class/updateInfor/${id}`, payload);
};

const updateClassMember = (id, payload) => {
    return putApi(`Class/updateMember/${id}`, payload);
};

const updateSubjectClass = (id, payload) => {
    return putApi(`Class/updateSubject/${id}`, payload);
};

const deleteDocumentInSubject = (params) => {
    if (params.slotId) {
        return putApi(`Document/removeDocInClass-Slot/${params.id}?docsId=${params.docsId}&slotId=${params.slotId}`);
    } else {
        return putApi(`Document/removeDocInClass-Slot/${params.id}?docsId=${params.docsId}`);
    }
};

// LEVEL
const updateLevel = (id, payload) => {
    return putApi(`Level/${id}`, payload);
};

// GRADE
const updateGrade = (id, payload) => {
    return putApi(`Grade/${id}`, payload);
};

// SUBJECT
const updateSubject = (id, payload) => {
    return putApi(`Subject/${id}`, payload);
};

// SLOT
const updateSlot = (id, payload) => {
    return putApi(`Slot/${id}`, payload);
};

// TYPE_DOCUMENT
const updateTypeDocument = (id, payload) => {
    return putApi(`TypeDocument/${id}`, payload);
};

const addTypeDocumentToSubject = (id, subjectId) => {
    return putApi(`TypeDocument/addTypeDocumentToSubject/${id}?subjectId=${subjectId}`);
};

const removeTypeDocumentToSubject = (id, subjectId) => {
    return putApi(`TypeDocument/removeTypeDocumentToSubject/${id}?subjectId=${subjectId}`);
};

// USER
const updateUser = (id, payload) => {
    return putApi(`User/${id}`, payload);
};

const updateProfile = (payload) => {
    return putApi('Auth/editMyProfile', payload);
};

const changePasswordUserAuth = (payload) => {
    return putApi('Auth/resetPassword', payload);
};

const changePasswordAdmin = (id) => {
    return putApi(`Auth/resetPasswordAdmin/${id}`);
};

const updateShareDocs = (id, payload) => {
    return putApi(`Document/updateShareDocs/${id}`, payload);
};
// ROLE
const updateRole = (id, payload) => {
    return putApi(`Role/${id}`, payload);
};

// Permission
const updatePermission = (id, payload) => {
    return putApi(`Permission/${id}`, payload);
};

const updateFolder = (id, payload) => {
    return putApi(`Folder/${id}`, payload);
};
// Period 
function getPeriodActive() {
    return getApi(`/Period/getPeriodActive`);
};
function getPeriodById(id) {
    return getApi(`/Period/getOne/${id}`);
};
function getAllPeriod(params) {
    return getApiV2('/Period/getAll', params);
};
const createPeriod = (payload) => {
    return postApi(`Period`, payload);
};
const updatePeriod = (id, payload) => {
    return putApi(`Period/${id}`, payload);
};
const deletePeriod = (id) => {
    return deleteApi(`Period/${id}`);
};
//export api here

function addParameter(url, params) {
    if (url) {
        Object.keys(params).forEach(function (key, index) {
            if (params[key]) {
                url = url.concat(`params[key]`);
            }
        });
    }
}

export {
    updateDocument,
    getCommonFiles,
    getFolderTree,
    checkDocCloseOpen,
    getPeriodActive,
    getPeriodById,
    getAllPeriod,
    createPeriod,
    updatePeriod,
    deletePeriod,
    deleteMenu,
    createMenu,
    updateMenu,
    getAllMenu2,
    setLocalStorage,
    getLocalStorage,
    clearLocalStorage,
    loginAuth,
    getMenuItems,
    getAllClass,
    getClassById,
    getAllSubject,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    postClass,
    updateClass,
    getAllGrade,
    getALlRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    createGrade,
    deleteGrade,
    updateGrade,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    createUserAuth,
    changePasswordUserAuth,
    getGradeById,
    postGrade,
    getAllLevel,
    createLevel,
    updateLevel,
    deleteLevel,
    getLevelById,
    getAllProgram,
    getProgramById,
    deleteProgram,
    updateProgram,
    createProgram,
    getAllDocument,
    deleteDocument,
    uploadFile,
    downloadFile,
    postFile,
    getAllSlot,
    getSlotById,
    createSlot,
    updateSlot,
    deleteSlot,
    getAllTypeDocument,
    getTypeDocumentById,
    postTypeDocument,
    deleteTypeDocument,
    updateTypeDocument,
    postDocument,
    postLevel,
    getAllPermission,
    getFolderByID,
    getStoreFolder,
    postFolder,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    getAllMyClass,
    getMyClassGetOne,
    getDocumentShareWithMe,
    getDocumentById,
    getDocInClass,
    getMenu,
    addShareDoc,
    updateShareDocs,
    postCopyDocsToFolder,
    updateClassMember,
    updateSubjectClass,
    postDocumentsInSlot,
    deleteFolder,
    updateFolder,
    deleteDocumentInSubject,
    getReport,
    getAllDocsReport,
    deleteClass,
    deleteSubjectInClass,
    addTypeDocumentToSubject,
    removeTypeDocumentToSubject,
    getAllMenu,
    getMenuById,
    postFileExcelAddMember,
    postFileExcelAddSubject,
    createManyUser,
    removeMemberInClass,
    updateProfile,
    changePasswordAdmin,
    getAllUsersWithInfo,
};
