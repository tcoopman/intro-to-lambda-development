aws dynamodb create-table --table-name dynamo-test --region us-east-1 \
  --attribute-definitions AttributeName=userid,AttributeType=S \
  --key-schema AttributeName=userid,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --query TableDescription.TableArn --output text
