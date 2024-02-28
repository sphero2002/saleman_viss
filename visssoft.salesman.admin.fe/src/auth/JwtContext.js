import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
// utils
import axios from '../utils/axios';
//
import { isValidToken, jwtDecode, setupLocalStorage } from './utils';
import { clearLocalStorage, loginAuth, getUserById, getLocalStorage, setLocalStorage } from '../dataProvider/agent';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
    ROLES: null,
    SUBJECTS: null,
    headOfSubject: null,
};

const reducer = (state, action) => {
    if (action.type === 'INITIAL') {
        return {
            isInitialized: true,
            isAuthenticated: action.payload.isAuthenticated,
            user: action.payload.user,
            ROLES: action.payload.user?.roles,
            SUBJECTS: action.payload.user?.subjects,
            headOfSubject: action.payload.user?.headOfSubject,
        };
    }
    if (action.type === 'LOGIN') {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
            ROLES: action.payload.user?.roles,
            SUBJECTS: action.payload.user?.subjects,
            headOfSubject: action.payload.user?.headOfSubject,
        };
    }
    if (action.type === 'REGISTER') {
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
        };
    }
    if (action.type === 'LOGOUT') {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
        };
    }

    return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(async () => {
        try {
            const accessToken = typeof window !== 'undefined' ? getLocalStorage('access_token') : '';

            if (accessToken && isValidToken(accessToken)) {
                setupLocalStorage(accessToken);
                const responseUser = await getUserById(jwtDecode(accessToken).nameid);

                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: true,
                        user: { ...responseUser.data.data },
                        ROLES: {
                            ...responseUser.data.data.roles,
                        },
                        SUBJECTS: {
                            ...responseUser.data.data.subjects,
                        },
                        headOfSubject: {
                            ...responseUser.data.data.headOfSubject,
                        },
                    },
                });
            } else {
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (error) {
            console.error(error);
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // LOGIN
    const login = async (username, password) => {
        const responseLogin = await loginAuth({ username, password });
        const { response } = responseLogin;
        if (response) {
            throw new Error(response.data.title);
        }
        const { accessToken } = responseLogin.data;
        clearLocalStorage();
        setupLocalStorage(accessToken);

        const decoded = jwtDecode(accessToken);
        const responseUser = await getUserById(decoded.nameid);

        dispatch({
            type: 'LOGIN',
            payload: {
                user: {
                    ...responseUser.data.data,
                },
                ROLES: {
                    ...responseUser.data.data.roles,
                },
                SUBJECTS: {
                    ...responseUser.data.data.subjects,
                },
                headOfSubject: {
                    ...responseUser.data.data.headOfSubject,
                },
            },
        });
    };

    // REGISTER
    const register = async (email, password, firstName, lastName) => {
        const response = await axios.post('/api/account/register', {
            email,
            password,
            firstName,
            lastName,
        });
        const { accessToken, user } = response.data;

        localStorage.setItem('access_token', accessToken);

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        });
    };

    // LOGOUT
    const logout = async () => {
        setupLocalStorage(null);
        dispatch({
            type: 'LOGOUT',
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
