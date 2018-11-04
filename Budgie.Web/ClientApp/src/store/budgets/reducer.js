import initialState from './initialState';
import * as types from './types'

export default function reducer(state, action) {
    state = state || initialState;

    if (action.type === types.requestBudgetType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveBudgetType) {
        return {
            ...state,
            budget: action.budget,
            loading: false
        }
    }

    return state;
};