
aws logs filter-log-events --log-group-name "/aws/lambda/web-api" --region us-east-1 --query "events[?starts_with(message, 'REPORT')].message"
aws logs filter-log-events --log-group-name "/aws/lambda/web-api" --region us-east-1
aws logs filter-log-events --log-group-name "/aws/lambda/web-api" --region us-east-1 --filter-pattern "rawBody"
aws logs filter-log-events --log-group-name "/aws/lambda/web-api" --region us-east-1 --filter-pattern "rawBody" --query events[].message --output text
aws apigateway get-rest-apis --query 'item[?name==`test-api`].[name,id]' --output table
aws logs filter-log-events --log-group-name "/aws/lambda/web-api" --region us-east-1 --query "events[?starts_with(message, 'REPORT')].message"

aws logs filter-log-events --log-group-name "/aws/lambda/using-dynamodb" --region us-east-1 --query "events[].message" --output text

get zip

aws lambda get-function --function-name "web-api" --region us-east-1
curl $(aws lambda get-function --function-name "web-api" --region us-east-1 --query "Code.Location" --output text) > output.zip

dynamodb
aws dynamodb list-tables
aws dynamodb describe-table --table-name dynamo-test

aws dynamodb scan --table-name dynamo-test --region us-east-1
