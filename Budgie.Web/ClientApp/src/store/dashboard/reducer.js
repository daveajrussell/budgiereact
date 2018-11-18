import initialState from './initialState'
import * as types from './types'

export default function reducer(state, action) {
    state = state || initialState;

    if (action.type === types.requestDashboardType) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type === types.receiveDashboardType) {
        return {
            ...state,
            dashboard: action.dashboard,
            loading: false
        }
    }

    if (action.type === types.dashboardFailureType) {
        return {
            ...state,
            loading: false
        }
    }

    return state;
};