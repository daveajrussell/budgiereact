import { history } from './history';

export function handleResponse(response) {
    return new Promise((resolve, reject) => {
        if (response.ok) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                response.json().then(json => resolve(json));
            } else {
                resolve();
            }
        } else {
            if (response.status === 401) {
                localStorage.removeItem('user');
                history.push('/login');
                reject();
            } else {
                response.text().then(text => reject(text));
            }
        }
    });
}

export function handleError(error) {
    return Promise.reject(error && error.message);
}