# Create dynamo table 

aws dynamodb create-table --table-name dynamo-test \
  --attribute-definitions AttributeName=userid,AttributeType=S \
  --key-schema AttributeName=userid,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --query TableDescription.TableArn --output text

# Create new user

http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

curl -H "Content-Type: application/json" -X POST --data @example.json https://xn4d1m1v69.execute-api.us-east-1.amazonaws.com/latest/user


curl -H "Content-Type: application/json" -X POST --data @example.json https://xn4d1m1v69.execute-api.us-east-1.amazonaws.com/latest/user

# Get the user
curl https://xn4d1m1v69.execute-api.us-east-1.amazonaws.com/latest/user/test

# passing arguments to npm

npm run update -- --configure-db dynamo-test
