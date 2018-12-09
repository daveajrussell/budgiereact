import { config } from '../config';
import { handleResponse } from './../rootService';
import authHeader from './../authHeader';

export const dashboardService = {
    getDashboard
};

function getDashboard(params) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/api/dashboard?range=${params.range}`, requestOptions)
        .then(handleResponse)
        .then(dashboard => dashboard);
}