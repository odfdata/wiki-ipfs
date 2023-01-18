<img src="https://user-images.githubusercontent.com/12898752/202769068-9708ec1b-da69-46fc-bd84-b3d260324bb1.png"/>

# Wiki IPFS

On-chain IPFS file search solution. 

Use **Wiki IPFS** to:
* connect IPFS CIDs and their file hash (SHA-256)
* search CIDs starting from a hash (to avoid duplicates)
* endorse a CID with your wallet

## How it works

There are **3 core parts** inside Wiki IPFS
* On-chain logic, together with a Chianlink Oracle, to store the match between hash and CIDs, and to publicly endorse CIDs
* **ChainLink Oracle** using **External Adaptors** feature, to certify the match between a CID and it's file(s) hash
* IPFS file publishing through [web3.storage](https://web3.storage/)

First of all, you need to **certify the match of a file on IPFS with its hash**. 
You can go to webapp homepage, and decide both to insert the CID of a file already deployed, 
or upload a file from our UI. In this second case, we'll use [web3.sotrage](https://web3.storage/) solution to host the file. 

If you decide to upload a new file, at the end of the upload you'll have to execute a transaction to publish 
the CID of the uploaded file. This is the transaction that triggers Oracle verification process.

Certification process is done via **Chainlink Oracle with External Adaptors**, and has the following steps:
* download the file
* generate the hash
* publish the match between CID and hash

Using the dApp you can also **search** for
* **an hash (SHA-256)**: useful when you want to know if a file is already present inside IPFS, to avoid re-uploading it. You can simply select the file and the UI generates the hash and search it for you.
* a CID: to check if the file has been already indexed. If not, you can start the index process, helping us to enrich our index

Once a CID is found, you can see how many addresses have **endorsed** that file. This is useful, for example, when you have a distributed workload, 
and you want to make sure you're processing only files approved by a specific wallet. See the Bacalhau example.

You can also **endorse** a CID you trust, or oppose, if you don't want to endorse anymore. Calling the smart contract `EndorseListRegistry.sol`, you can 
query if a specific CID is endorsed by a specific wallet address.

## Benefits

We can list the top 3 main benefits:
* **avoid redundant files** on IPFS - same file can have different CIDs due to different factors (CIDv0 vs CIDv1, chunk size, etc)
* **connect a DID identity** to an IPFS file, publicly endorsing it
* **timestamp** file creation

## Current deployment

At the moment the solution is deployed on Polygon Mumbai

* **Operator.sol**  [0x3c72382DB6FB9410fe33f72e9e04619b6737A965](https://mumbai.polygonscan.com/address/0x3c72382db6fb9410fe33f72e9e04619b6737a965)
* **EndorseCIDRegistry.sol** [0xD843359f82D82306CB9d6c5FC1290a93b558AF87](https://mumbai.polygonscan.com/address/0xd843359f82d82306cb9d6c5fc1290a93b558af87)
* **CID2HashRegistry.sol** [0x35912ec51ED76af08311346A118047dBC1d06Fe7](https://mumbai.polygonscan.com/address/0x35912ec51ed76af08311346a118047dbc1d06fe7)
* **CID2HashOracleLogic.sol** [0x3B558E71D2A6203D08B2FA8751d743Fa9F181Eac](https://mumbai.polygonscan.com/address/0x3b558e71d2a6203d08b2fa8751d743fa9f181eac)

It is also deployable on Filecoin Virtual Machine (FEVM), see the instruction in the `contracts` readme. Once the FEVM will be put
in production, this will be the only chain supported.

For the Chainlink Oracle, its Docker image is running as a serverless container in AWS (using AWS Fargate) and each verification requests is handled by a Lambda Function.

IPFS storage used via our GUI uses the SDK and functionalities of Web3.Storage

## Examples

You can check our [Bacalhau example](https://github.com/fedecastelli/wiki-ipfs/tree/master/bacalhau)

## Known limitations

Solution can be improved with the following integrations:
* use of a DID service to add trusted identities to IPFS files
* Bacalhau example will work only if you run on a node that support HTTP external calls (see https://github.com/filecoin-project/bacalhau/issues/856 )


