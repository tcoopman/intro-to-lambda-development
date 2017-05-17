/*global require, module*/
const ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

const getTableName = (request) => request.env.tableName;

api.post('/user', function (request) {
	const TableName = getTableName(request);
	const params = {
		TableName,
		Item: {
			userid: request.body.userId,
			name: request.body.name,
			age: request.body.age
		}
	};
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

api.get('/user/{userid}', function (request) {
	const userid = unescape(request.pathParams.userid);
	const TableName = getTableName(request);
	const params = {
		TableName,
		Key: {
			userid
		}

	}
	return dynamoDb.get(params).promise();
});

api.get('/user', function (request) {
	console.log(request);
	const TableName = getTableName(request);
	const params = {
		TableName
	}
	return dynamoDb.scan(params).promise();
});

api.addPostDeployConfig(
	'tableName',
	'DynamoDB Table Name:',
	'configure-db'
);