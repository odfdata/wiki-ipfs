# Welcome to Chailink External Adapter CDK TypeScript project

This is the CDK template to create the external adapter on AWS console. 

The external adapter is responsible of receiving an IPFS CID, download the file, calculate the hash and return a response. Thanks to Chainlink, the response will be decoupled and used as parameters to fullfill the original request.

The external adapter is an AWS Lambda function and it's publicly exposed thanks to the `Function URL` functionality (before it was required an API Gateway in front of the AWS Lambda function to be able to call it as an external adapter).

## Deploy

To deploy an update on AWS, run the following commands:

+ `cdk synth`
+ `cdk deploy --app "cdk.out" ClExternalAdapterStack --profile {profile_name} --region {region_name}`
