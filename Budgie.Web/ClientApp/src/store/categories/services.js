import { config } from '../config';
import { handleResponse } from './../rootService';
import authHeader from './../authHeader';

export const categoryService = {
    getAllCategories,
    createNewCategory,
    deleteCategory,
    editCategory
};

function getAllCategories() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(config.apiUrl + '/api/categories', requestOptions)
        .then(handleResponse)
        .then(categories => categories);
}

function createNewCategory(category) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(category)
    };

    return fetch(config.apiUrl + '/api/categories', requestOptions)
        .then(handleResponse)
        .then(category => category);
}

function deleteCategory(category) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/api/categories/${category.id}`, requestOptions)
        .then(handleResponse);
}

function editCategory(category) {
    const requestOptions = {
        method: 'PATCH',
        headers: authHeader(),
        body: JSON.stringify(category)
    };

    return fetch(config.apiUrl + '/api/categories/edit', requestOptions)
        .then(handleResponse)
        .then(category => category);
}