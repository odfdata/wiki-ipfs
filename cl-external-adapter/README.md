# Welcome to Chainlink External Adapter CDK TypeScript project

This is the CDK template to create the external adapter on AWS console with all the required
resources neeeded by the processes.

The External Adapter is responsible for received IPFS CIDs, publish them in an event bus e return a response
to notify the Chainlink Job that it has to wait for a callback.

The AWS Lambda responsible for starting the hashing process and the publication on Chainlink is subscribed to
the AWS Event Bus. Once the correct event is received, it is triggered and the process starts.

## How to deploy

You need to create a `.env` file to create and deploy the AWS CDK template. You can just copy and rename the 
file `.env.example` with the correct variable names.

+ `IPFS_PROTOCOL`: the HTTP protocol we need to use to communicate with your IPFS node
+ `IPFS_IP_ADDRESS`: the IPFS node address
+ `IPFS_API_PORT`: the HTTP port to be used to call the APIs
+ `IPFS_API_DOWNLOAD_FILE_PORT`: the HTTP port to be used to download files from
+ `IPFS_AUTHORIZATION_TOKEN`: the authorization token to be used to call the IPFS node

Once you have your `.env` file correctly configured, you are ready to deploy everything on AWS running the 
following commands:

+ `cdk synth` --> synthetize the AWS CDK template
+ `cdk deploy --profile {profile_name} --region {region_name}` --> deploy all the resources on AWS

# Known limitations

+ Max file size supported is 500 MB if you want to index hash and CID. This limitation applies since 
  we are using AWS Lambda with no storage attached.
