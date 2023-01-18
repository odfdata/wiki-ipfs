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
5. Start the official Chainlink docker image running the following command:
   ```bash
   docker run -p 6688:6688 -v ~/.chainlink-mumbai:/chainlink -it -d --env-file=.env smartcontract/chainlink:1.11.0-root local n -p /chainlink/.password -a /chainlink/.api
   ```

### .env file configuration

In this file, you have to configure the following environment variables:

```bash
echo "LOG_LEVEL=debug
ETH_CHAIN_ID=8001
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=*
ETH_URL={change_me}
DATABASE_URL=postgresql://postgres:mysecretpassword@host.docker.internal:5432/postgres?sslmode=disable
BRIDGE_RESPONSE_URL={bridge_response_url}" > ~/.chainlink-mumbai/.env
```

It's important to set the env variable `BRIGDE_RESPONSE_URL` since we are using `async` bridge task. It is
the variable needed to send the `responseUrl` parameter to finish the chainlink job exection.

### .password file configuration

In this file, you have to configure the wallet keystore password. You can create the `.password` file 
running the following command:

```bash
echo "my_wallet_password" > ~/.chainlink-mumbai/.password
```

### .api file configuration

In this file, you have to configure the username and password to be used to login in Chainlink Node.
You can create the `.api` file running the following commands:

```bash
echo "user@example.com" > ~/.chainlink-mumbai/.api
echo "{password}" > ~/.chainlink-mumbai/.api
```

## Bridge Configuration
Our Bridge is an AWS Lambda Function with an associated Function URL to be exposed to the public.
This infrastructure allows us to automatically scale up and down the computing power and also 
to pay 0$ in case we have no Chainlink Oracle invocations.

Our Bridge is called `generate-hash` and it's responsible for getting the Chainlink Jobs information,
publish them in an EventBridge Custom Bus. There's an AWS Lambda subscribed that once the correct event
is received, it starts the generate hash process. The response to the Chainlink Node is a JSON with
this information:

```json
{
   "pending": true
}
```

The response above tells to the Chainlink Job that it has to wait for an HTTP PATCH api call to finish
the job.

Once the generate hash process is finished, the process calls the `responseURL` parameter received before
with the HTTP Method PATCH with the following parameters:

```json
{
   "value": {
      "data": {
         "CIDList": ["aaaa...fff", "bbb...ggg"],
         "hashList": ["0x...", "0x..."]
      }
   }
}
```


## Job Configuration
The job is configured to receive a list of CIDs, send them as parameter to the Bridge URL with 
an asynchronous invocation. 

The job is called `Get > String[], Bytes32[]` and this is the TOML configuration to create it:

```toml
type = "directrequest"
schemaVersion = 1
name = "Get > String[], Bytes32[]"
externalJobID = "22009141-c493-478c-ae3d-0d6b09cbc0b7"
contractAddress = "oracle_address" # oracle contract address
minContractPaymentLinkJuels = "0"
observationSource = """
    decode_log      [type="ethabidecodelog"
                     abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                     data="$(jobRun.logData)"
                     topics="$(jobRun.logTopics)"
                    ]

    decode_cbor     [type="cborparse" data="$(decode_log.data)"]
    fetch           [type="bridge"
                     name="generate-hash"
                     requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": {\\"CIDList\\": $(decode_cbor.cid)}}"
                     async=true
                    ]
    parse           [type="jsonparse" path="data" data="$(fetch)"]
    encode_data     [type="ethabiencode" abi="(bytes32 requestId, string[] CIDList, bytes32[] evalHashList)" data="{ \\"requestId\\": $(decode_log.requestId), \\"CIDList\\": $(parse.CIDList), \\"evalHashList\\": $(parse.evaluatedHashList)}"]
    encode_tx       [type="ethabiencode"
                      abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                      data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                    ]
    submit_tx    [type="ethtx" to="{oracle_address}" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```

## Generate Hash Process

In this section you will find how the hash process is handled, based on the CID type:

+ **CID single file:** Oracle gets the file, produces the sha-256 and returns the pair CID-hash to the smart contract
+ **the CID is a folder with a single file:** Oracle gets the file, produces the sha-256 of the file and returns two 
pairs. The first is the fileCID-hash pair, the second is the folderCID-hash pair. The folderCID is the same CID 
provided by the user to the smart contract
+ **the CID is a folder with multiple files inside (and folders too):** the Chainlink Oracle gets all the files, 
orders them following the given path on IPFS, hash each of them, producing a list of hashes (in the same order of 
the files). That list is used to generate a Merkle Tree, and the paid CID-hash is returned, where the hash is 
the Merkle Tree Root hash
