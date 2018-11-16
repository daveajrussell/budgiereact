import { config } from '../config';
import { handleError, handleResponse } from './../rootService';
import authHeader from './../authHeader';

export const budgetService = {
    getBudget,
    addTransaction,
    editTransaction,
    deleteTransaction,
    editOutgoing
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
        headers: authHeader(),
        body: JSON.stringify(transaction)
    };

    return fetch(`${config.apiUrl}/api/budgets/transaction/${transaction.id}`, requestOptions)
        .then(handleResponse, handleError)
        .then(transaction => transaction);
}

function editOutgoing(outgoing) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(outgoing)
    };

    return fetch(`${config.apiUrl}/api/budgets/outgoings/${outgoing.id}`, requestOptions)
        .then(handleResponse, handleError)
        .then(outgoing => outgoing);
}