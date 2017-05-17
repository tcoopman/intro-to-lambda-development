const API = require('claudia-api-builder'),
	api = new API();

module.exports = api;

api.get('/hello/{name}/{lastname}', function (request) {
	const {name, lastname} = request.pathParams;
	if (name === 'foo') {
		throw new  Error("Incorrect name");
	}
	console.log(request);
	return `hello ${name} ${lastname}`;
}, {
	success: {contentType: 'text/hmtl'},
	error: { code: 403 }
});
