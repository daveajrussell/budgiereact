import initialState from './initialState';
import * as types from './types'

export default function reducer(state, action) {
    let user = JSON.parse(localStorage.getItem('user'));
    state = user ? { isLoggedIn: true, user } : state || initialState;

    if (action.type === types.requestLoginType) {
        return {
            ...state,
            username: action.username,
            loggingIn: true,
            loginSuccess: false,
            isLoggedIn: false
        };
    }

    if (action.type === types.receiveLoginType) {
        return {
            ...state,
            user: {
                firstName: action.user.firstName,
                lastName: action.user.lastName,
                token: action.user.token,
            },
            isLoggedIn: true,
            loginSuccess: true,
            loggingIn: false
        };
    }

    if (action.type === types.loginFailureType) {
        return {
            ...state,
            loggingIn: false,
            message: action.message,
            loginSuccess: false
        }
    }

    if (action.type === types.requestLogoutType) {
        return {
            ...state,
            user: {},
            isLoggedIn: false,
            isLoggingIn: false
        }
    }

    if (action.type === types.requestRegistrationType) {
        return {
            ...state,
            user: action.user,
            registering: true
        };
    }

    if (action.type === types.receiveRegistrationType) {
        return {
            ...state,
            user: action.user,
            registering: false,
            registrationSuccess: true
        };
    }

    if (action.type === types.registrationFailureType) {
        return {
            ...state,
            message: action.message,
            registering: false,
            registrationSuccess: false
        }
    }

    return state;
};