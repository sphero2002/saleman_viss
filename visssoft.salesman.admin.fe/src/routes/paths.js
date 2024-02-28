// ----------------------------------------------------------------------

import { is } from 'date-fns/locale';

function path(root, sublink) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    verify: path(ROOTS_AUTH, '/verify'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    about: '/about-us',
    faqs: '/faqs',
    page403: '/403',
    page404: '/404',
    page500: '/500',
};

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    home: path(ROOTS_DASHBOARD, '/home'),
    fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
    permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
    blank: path(ROOTS_DASHBOARD, '/blank'),

    class: {
        root: path(ROOTS_DASHBOARD, '/class'),
        detail: (class_id) => path(ROOTS_DASHBOARD, `/class/${class_id}`),
        new: path(ROOTS_DASHBOARD, '/class/new'),
        create: path(ROOTS_DASHBOARD, '/class/create'),
        edit: (class_id) => path(ROOTS_DASHBOARD, `/class/${class_id}/edit`),
        addStudent: (class_id) => path(ROOTS_DASHBOARD, `/class/${class_id}/addStudent`),
        addmembers: (class_id) => path(ROOTS_DASHBOARD, `/class/${class_id}/addmembers`),
        subject: (class_id, subject_id, action) =>
            path(ROOTS_DASHBOARD, `/class/${class_id}/${subject_id}?action=${action}`),
    },
    myclass: {
        root: path(ROOTS_DASHBOARD, '/myclass'),
        classdetail: (myclass_id) => path(ROOTS_DASHBOARD, `/myclass/${myclass_id}`),
        classsubject: (myclass_id, mysubject_id) => path(ROOTS_DASHBOARD, `/myclass/${myclass_id}/${mysubject_id}`),
        addMember: (myclass_id) => path(ROOTS_DASHBOARD, `/myclass/${myclass_id}/addMember`),
    },

    general: {
        app: path(ROOTS_DASHBOARD, '/app'),
    },

    folder: {
        root: path(ROOTS_DASHBOARD, `/folder/0`),
        link: (folder_id) => path(ROOTS_DASHBOARD, `/folder/${folder_id ? folder_id : 0}`),
        newDocument: (folder_id) => path(ROOTS_DASHBOARD, `/folder/${folder_id ? folder_id : 0}/new`),
    },

    storeFolder: {
        root: path(ROOTS_DASHBOARD, `/storeFolder`),
        link: (storeFolder_id) => path(ROOTS_DASHBOARD, `/storeFolder/${storeFolder_id ? storeFolder_id : 0}`),
        newDocument: (storeFolder_id) => path(ROOTS_DASHBOARD, `/storeFolder/${storeFolder_id ? storeFolder_id : 0}/new`),
    },

    uploadfiles: {
        root: path(ROOTS_DASHBOARD, `/uploadfiles`),
        link: (uploadfile_id) => path(ROOTS_DASHBOARD, `/uploadfiles/${uploadfile_id ? uploadfile_id : 0}`),
        newDocument: (uploadfile_id) => path(ROOTS_DASHBOARD, `/uploadfiles/${uploadfile_id ? uploadfile_id : 0}/new`),
    },

    user: {
        root: path(ROOTS_DASHBOARD, '/user'),
        new: path(ROOTS_DASHBOARD, '/user/new'),
        list: path(ROOTS_DASHBOARD, '/user/list'),
        account: path(ROOTS_DASHBOARD, '/user/account'),
        edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    },
    program: {
        choose: path(ROOTS_DASHBOARD, '/program'),
        root: path(ROOTS_DASHBOARD, '/program/manage'),
        new: path(ROOTS_DASHBOARD, '/program/manage/new'),
        list: path(ROOTS_DASHBOARD, '/program/manage/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/program/${name}/edit`),
        level: (id) => path(ROOTS_DASHBOARD, `/program/level/${id}`),
        gradeSub: (id, classId) => path(ROOTS_DASHBOARD, `/program/gradeSub/${id}/${classId}`),
    },
    grade: {
        root: path(ROOTS_DASHBOARD, '/grade'),
        new: path(ROOTS_DASHBOARD, '/grade/new'),
        list: path(ROOTS_DASHBOARD, '/grade/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/grade/${name}/edit`),
    },
    level: {
        root: path(ROOTS_DASHBOARD, '/level'),
        new: path(ROOTS_DASHBOARD, '/level/new'),
        list: path(ROOTS_DASHBOARD, '/level/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/level/${name}/edit`),
    },
    subject: {
        root: path(ROOTS_DASHBOARD, '/subject'),
        new: path(ROOTS_DASHBOARD, '/subject/new'),
        list: path(ROOTS_DASHBOARD, '/subject/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/subject/${name}/edit`),
    },
    slot: {
        root: path(ROOTS_DASHBOARD, '/slot'),
        new: path(ROOTS_DASHBOARD, '/slot/new'),
        list: path(ROOTS_DASHBOARD, '/slot/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/slot/${name}/edit`),
    },
    documents: {
        root: path(ROOTS_DASHBOARD, '/documents'),
        posts: path(ROOTS_DASHBOARD, '/documents/document/posts'),
        new: path(ROOTS_DASHBOARD, '/documents/document/new'),
        view: (id) => path(ROOTS_DASHBOARD, `/documents/document/post/${id}`),
        demoView: path(ROOTS_DASHBOARD, '/documents/document/post/apply-these-7-secret-techniques-to-improve-event'),
    },

    type_documents: {
        root: path(ROOTS_DASHBOARD, '/typeDocs'),
        new: path(ROOTS_DASHBOARD, '/typeDocs/new'),
        list: path(ROOTS_DASHBOARD, '/typeDocs/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/typeDocs/${name}/edit`),
    },
    role: {
        root: path(ROOTS_DASHBOARD, '/roles'),
        new: path(ROOTS_DASHBOARD, '/roles/new'),
        list: path(ROOTS_DASHBOARD, '/roles/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/roles/${name}/edit`),
    },
    permission: {
        root: path(ROOTS_DASHBOARD, '/permission'),
        new: path(ROOTS_DASHBOARD, '/permission/new'),
        list: path(ROOTS_DASHBOARD, '/permission/list'),
        edit: (name) => path(ROOTS_DASHBOARD, `/permission/${name}/edit`),
    },
    menu: {
        root: path(ROOTS_DASHBOARD, '/menu'),
        new: path(ROOTS_DASHBOARD, '/menu/new'),
        list: path(ROOTS_DASHBOARD, '/menu/list'),
        edit: (id) => path(ROOTS_DASHBOARD, `/menu/${id}/edit`),
    },
    period: {
        root: path(ROOTS_DASHBOARD, '/period'),
        new: path(ROOTS_DASHBOARD, '/period/new'),
        list: path(ROOTS_DASHBOARD, '/period/list'),
        edit: (id) => path(ROOTS_DASHBOARD, `/period/${id}/edit`),
    },
    processDoc: {
        root: path(ROOTS_DASHBOARD, '/processDoc'),
        new: path(ROOTS_DASHBOARD, '/processDoc/new'),
        list: path(ROOTS_DASHBOARD, '/processDoc/list'),
        createNewDoc: path(ROOTS_DASHBOARD, '/processDoc/createNewDoc'),
        sharedocs: path(ROOTS_DASHBOARD, '/processDoc/sharedocs'),
        editdoc: (id) => path(ROOTS_DASHBOARD, `/processDoc/${id}/editdoc`), 
        shareddocinfo: path(ROOTS_DASHBOARD, '/processDoc/shareddocinfo'),
        docdetail: (id) => path(ROOTS_DASHBOARD, `/processDoc/${id}/docdetail`), 
    },
};
