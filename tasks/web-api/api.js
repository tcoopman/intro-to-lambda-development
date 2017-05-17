const API = require('claudia-api-builder'),
	api = new API();

module.exports = api;

api.get('/hello/{name}/{lastname}', function (request) {
	const {name, lastname} = request.pathParams;
	return `hello ${name} ${lastname}`;
});
