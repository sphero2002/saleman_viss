import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import classReducer from './slices/class';
import programReducer from './slices/program';
import gradeReducer from './slices/grade';
import folderReducer from './slices/folder';
import documentReducer from './slices/document';
import userReducer from './slices/user';
import myClassReducer from './slices/myclass';
import subjectReducer from './slices/subject';
import roleReducer from './slices/roles';
import dataReducer from './slices/data';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
    getItem() {
        return Promise.resolve(null);
    },
    setItem(_key, value) {
        return Promise.resolve(value);
    },
    removeItem() {
        return Promise.resolve();
    },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [],
};

const productPersistConfig = {
    key: 'product',
    storage,
    keyPrefix: 'redux-',
    whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
    mail: mailReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    kanban: kanbanReducer,
    product: persistReducer(productPersistConfig, productReducer),
    class: classReducer,
    program: programReducer,
    grade: gradeReducer,
    folder: folderReducer,
    document: documentReducer,
    user: userReducer,
    myclass: myClassReducer,
    role: roleReducer,
    subject: subjectReducer,
    data: dataReducer,
});

export { rootPersistConfig, rootReducer };
