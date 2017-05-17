const API = require('claudia-api-builder'),
	api = new API();

module.exports = api;

api.get('/hello', function (request) {
	const name = request.queryString.name;
	return `hello ${name}`;
});
