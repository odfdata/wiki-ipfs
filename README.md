[_INSERT_IMAGE_LOGO]

# Wiki IPFS

On-chain IPFS file search system. 

Wiki IPFS you can:
* connect IPFS CIDs and their file hash
* search CIDs starting from an hash file
* collect the ownership of the person that paid for the file verification

## How it works

There are 3 core parts inside our solution
* A Smart Contract deployed Polygon Mumbai, together with the Chainlink Oracle contract
* ChainLink Oracle using External Adaptors feature, to certify the match between a CID and it's file(s) hash
* IPFS (using web3.storage) to publish files on IPFS

We've also created an example of the benefits this method brings, using Bacalhau network of open compute resources.

First of all, you need to **certify the match of a file on IPFS with its hash**. 
You can go to [_Insert public page lin__] and decide both to insert the CID of a file already deployed, 
or upload a file from our UI. In this second case, we'll use [web3.sotrage](https://web3.storage/) solution. 

If you decide to upload a new file, at the end of the upload you'll have to do a call to our smart contracts to publish 
the CID of the uploaded file. That call triggers the Oracle verification process, divided in the following steps:
* download the file
* generate the hash
* publish the match between CID and hash

On our dApp you can search for
* an hash (SHA-256): useful when you want to know if a file is already present inside IPFS, to avoid re-uploading it. You can simply select the file and the UI generates the hash and search it for you.
* a CID: to check if the file has been already indexed. If not, you can start the index process, helping us to enrich our index

Finally, you can get also the wallet address that required the certification of a file. This is useful, for example, when you have a distributed workload, 
and you want to make sure you're processing only documents approved by a specific wallet. See the Bacalhau example.

# Current deployment

At the moment the solution is deployed on Polygon Mumbai

* **Chainlink Oracle contact** [0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c](https://mumbai.polygonscan.com/address/0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c)
* **CIDMatcher contract** [0x553DcF1b90F0bF964219aC430C547822456EB287](https://mumbai.polygonscan.com/address/0x553DcF1b90F0bF964219aC430C547822456EB287)

The frontend is hosted on Amazon Web Services [____insert the link_____]

Chainlink Docker image is running as a serverless container in AWS (using AWS Fargate) and each verification requests is handled by a Lambda Function.

IPFS storage used via our GUI uses the SDK and functionalities of Web3.Storage

## Examples

You can check our [Bacalhau example](INSERT_LINK)

## known limitations

Solution can be improved with the following integrations:
* use of a DID service (like PolygonID) to add trusted identities to IPFS files
* allow the oracle to verify IPFS directories (CID with multiple files inside)



