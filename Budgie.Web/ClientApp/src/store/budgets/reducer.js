import initialState from './initialState';
import * as types from './types'

export default function reducer(state, action) {
    state = state || initialState;

    return state;
};