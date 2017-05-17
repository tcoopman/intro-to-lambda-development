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
	const TableName = getTableName(request);
	const params = {
		TableName
	}
	return dynamoDb.scan(params).promise();
});

const createScanFilter = (name, age) => {
	const ScanFilter = {};
	if (name) {
		ScanFilter.name = {
			AttributeValueList: [name],
			ComparisonOperator: "CONTAINS"
		}
	}
	age = Number.parseInt(age);
	if (Number.isFinite(age)) {
		ScanFilter.age = {
			AttributeValueList: [age],
			ComparisonOperator: "EQ"
		}

	}
	return ScanFilter;
}

api.get('/user/search', function (request) {
	const TableName = getTableName(request);

	const {name, age} = request.queryString;
	const params = {TableName, ScanFilter: createScanFilter(name, age)};
	console.log(JSON.stringify(params, null, 4));

	return dynamoDb.scan(params).promise();

});

api.addPostDeployConfig(
	'tableName',
	'DynamoDB Table Name:',
	'configure-db'
);