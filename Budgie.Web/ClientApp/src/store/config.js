const isDevelopment = process.env.NODE_ENV === 'development';
let apiUrl = '';

if (isDevelopment) apiUrl = 'https://localhost:5001';
else apiUrl = 'https://budgiereact.azurewebsites.net';

export const config = {
	apiUrl: apiUrl
};