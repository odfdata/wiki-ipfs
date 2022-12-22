<img src="https://user-images.githubusercontent.com/12898752/202769068-9708ec1b-da69-46fc-bd84-b3d260324bb1.png"/>

# Wiki IPFS

On-chain IPFS file search solution. 

Use **Wiki IPFS** to:
* connect IPFS CIDs and their file hash (SHA-256)
* search CIDs starting from an hash (to avoid duplicates)
* connect a wallet address to a CID

## How it works

There are **3 core parts** inside Wiki IPFS
* A Smart Contract (currently deployed Polygon Mumbai), together with a Chainlink Oracle contract
* **ChainLink Oracle** using **External Adaptors** feature, to certify the match between a CID and it's file(s) hash
* IPFS file publishing through [web3.storage](https://web3.storage/)

First of all, you need to **certify the match of a file on IPFS with its hash**. 
You can go to [our homepage](https://master.dkdekidbckxe.amplifyapp.com/) and decide both to insert the CID of a file already deployed, 
or upload a file from our UI. In this second case, we'll use [web3.sotrage](https://web3.storage/) solution to host the file. 

If you decide to upload a new file, at the end of the upload you'll have to execute a transaction to publish 
the CID of the uploaded file. This is the transaction that triggers Oracle verification process.

Certification process is done via **Chainlink Oracle with External Adaptors**, and has the following steps:
* download the file
* generate the hash
* publish the match between CID and hash

Visiting [our dApp](https://master.dkdekidbckxe.amplifyapp.com/) you can search for
* **an hash (SHA-256)**: useful when you want to know if a file is already present inside IPFS, to avoid re-uploading it. You can simply select the file and the UI generates the hash and search it for you.
* a CID: to check if the file has been already indexed. If not, you can start the index process, helping us to enrich our index
* get the **wallet address** that required the indicization of a file. This is useful, for example, when you have a distributed workload, 
and you want to make sure you're processing only documents approved by a specific wallet. See the Bacalhau example.

## Benefits

We can list the top 3 main benefits:
* **avoid redundant files** on IPFS - same file can ahve different CIDs due to different factors (CIDv0 vs CIDv1, chunk size, etc)
* **connect a DID identity** to an IPFS file
* **timestamp** file creation

## Current deployment

At the moment the solution is deployed on Polygon Mumbai

* **Chainlink Oracle contact** [0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c](https://mumbai.polygonscan.com/address/0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c)
* **CIDMatcher contract** [0x553DcF1b90F0bF964219aC430C547822456EB287](https://mumbai.polygonscan.com/address/0x553DcF1b90F0bF964219aC430C547822456EB287)

Chainlink Docker image is running as a serverless container in AWS (using AWS Fargate) and each verification requests is handled by a Lambda Function.

IPFS storage used via our GUI uses the SDK and functionalities of Web3.Storage

## Examples

You can check our [Bacalhau example](https://github.com/fedecastelli/wiki-ipfs/tree/master/bacalhau)

## Known limitations

Solution can be improved with the following integrations:
* use of a DID service (like PolygonID) to add trusted identities to IPFS files
* allow the oracle to verify IPFS directories (CID with multiple files inside)
* bacalhau example doesn't work due to this issue https://github.com/filecoin-project/bacalhau/issues/856


