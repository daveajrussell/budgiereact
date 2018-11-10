import { config } from '../config';
import { handleError, handleResponse } from './../rootService';
import authHeader from './../authHeader';

export const budgetService = {
    getBudget,
    addTransaction,
    editTransaction,
    deleteTransaction
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

function addTransaction(transaction) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(transaction)
    };

    return fetch(`${config.apiUrl}/api/budgets/transaction`, requestOptions)
        .then(handleResponse, handleError)
        .then(transaction => transaction);
}

function editTransaction(transaction) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(transaction)
    };

    return fetch(`${config.apiUrl}/api/budgets/transaction/${transaction.id}`, requestOptions)
        .then(handleResponse, handleError)
        .then(transaction => transaction);
}

function deleteTransaction(transaction) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/api/budgets/transaction/${transaction.id}`, requestOptions)
        .then(handleResponse, handleError)
        .then(transaction => transaction);
}