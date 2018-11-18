import * as types from './types'
import { dashboardService } from './services';

export const actionCreators = {
    getDashboard: (params) => (dispatch) => {
        dispatch({ type: types.requestDashboardType });

        dashboardService
            .getDashboard(params)
            .then((dashboard) => {
                dispatch({ type: types.receiveDashboardType, dashboard: dashboard });
            })
            .catch((error) => {
                dispatch({ type: types.dashboardFailureType });
            });
    }
};