/*global require, module*/
const API = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	S3 = new AWS.S3(),
	api = new API();

module.exports = api;

const createHiddenFields = (fields) =>
	Object.keys(fields).map(key => 
		`<input type="hidden" name="${key}" value="${fields[key]}" />`
	).join("");

const createForm = (url, fields) => `
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>

  <form action="${url}" method="post" enctype="multipart/form-data">
    Key to upload: 
	${createHiddenFields(fields)}
	<input type="file" name="file" />
    <input type="submit" name="submit" value="Upload to Amazon S3" />
  </form>
</html>
`

api.get('/upload-file', request => {
	'use strict';
	const params = {
		Bucket: request.env.bucketName,
		Fields: {
			key: 'upload/' + request.lambdaContext.awsRequestId
		}
	};
	const {url, fields} =  S3.createPresignedPost(params);
	const form = createForm(url, fields);

	return form;

}, {
	success: {contentType: 'text/html'},
});


api.addPostDeployConfig('bucketName', 'Upload bucket name', 'configure-bucket');
