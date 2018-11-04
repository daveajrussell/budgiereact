import { config } from '../config';
import { handleError, handleResponse } from './../rootService';
import authHeader from './../authHeader';

export const budgetService = {
    getBudget
};

function getBudget(year, month) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/api/budgets/${year}/${month}`, requestOptions)
        .then(handleResponse, handleError)
        .then(budget => budget);
}