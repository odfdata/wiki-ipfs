# CL Node

## CL Node Configuration
Here you can find all the steps done to configure our Chainlink Node.

1. Create an EC2 instance on AWS Console
2. Install Docker
3. Create RDS instance with PostgreSQL engine
4. Create the folder `.chainlink-mumbai/` with the following files:
   1. `.env`: containing all the variables like chain id, database url, etc
   2. `.password`: the keystore password
   3. `.api`: username and password to login in Chainlink Operator UI

## Bridge Configuration
Our Bridge is an AWS Lambda Function running behind AWS API Gateway. 
This infrastructure allows us to automatically scale up and down the
computing power and also to pay 0$ in case we have no Chainlink Oracle
invocations.

Our Bridge is called `aws-file-to-hash` and it's responsible for
getting files from IPFS using the `web3.storage` sdk and generate
the SHA-256 of the content as response.

## Job Configuration
The job is configured to receive a list of CIDs, send them as parameter
to the Bridge URL, get the response and call the `fulfillOracleRequest2()`
with the correct parameters.

The job is called `Get > String[], Bytes32[]`
