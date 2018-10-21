const isDevelopment = process.env.NODE_ENV === 'development';
let apiUrl = '';

if (isDevelopment) apiUrl = 'https://localhost:44338';
else apiUrl = 'https://budgiereact.azurewebsites.net';

export const config = {
	apiUrl: apiUrl
};