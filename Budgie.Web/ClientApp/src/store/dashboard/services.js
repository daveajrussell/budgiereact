import { config } from '../config';
import { handleError, handleResponse } from './../rootService';
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
        .then(handleResponse, handleError)
        .then(dashboard => dashboard);
}