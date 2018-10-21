import { userService } from './services';
import { history } from './../history';
import * as types from './types';

export const actionCreators = {
    login: (username, password) => (dispatch) => {
        dispatch({ type: types.requestLoginType, username });

        userService
            .login(username, password)
            .then((user) => {
                dispatch({ type: types.receiveLoginType, user });
                history.push('/');
            })
            .catch((error) => {
                dispatch({ type: types.loginFailureType, message: error });
            });
    },

    logout: () => (dispatch) => {
        dispatch({ type: types.requestLogoutType });
        userService.logout();
    },

    register: (user) => (dispatch) => {
        dispatch({ type: types.requestRegistrationType, user });

        userService
            .register(user)
            .then(() => {
                dispatch({ type: types.receiveRegistrationType });
                history.push('/login');
            })
            .catch((error) => {
                dispatch({ type: types.registrationFailureType, message: error });
            });
    }
};