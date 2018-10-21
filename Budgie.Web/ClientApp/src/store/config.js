const isDevelopment = process.env.NODE_ENV === 'development';
let apiUrl = '';

if (isDevelopment) apiUrl = 'http://localhost:50098';
else apiUrl = 'https://budgiereact.azurewebsites.net';

export const config = {
	apiUrl: apiUrl
};