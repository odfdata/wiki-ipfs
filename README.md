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

## How to deploy

1. Set up an [IPFS node](https://github.com/odfdata/wiki-ipfs/tree/master/ipfs-node)
2. Launch your [Chainlink Node](https://github.com/odfdata/wiki-ipfs/tree/master/cl-node)
3. Deploy the [backend infrastracture](https://github.com/odfdata/wiki-ipfs/tree/master/cl-external-adapter) to listen to incoming oracle requests
4. Deploy the [smart contracts](https://github.com/odfdata/wiki-ipfs/tree/master/contracts)
4. Launch the [frontend](https://github.com/odfdata/wiki-ipfs/tree/master/web-app)

## Benefits

We can list the top 3 main benefits:
* **avoid redundant files** on IPFS - same file can have different CIDs due to different factors (CIDv0 vs CIDv1, chunk size, etc)
* **connect a DID identity** to an IPFS file, publicly endorsing it
* **timestamp** file creation

## Current deployment

At the moment the solution is deployed on Hyperspace (FEVM) and Polygon Mumbai.

We have also a [LIVE deployed version of the frontend](https://master.d1yjc3iv5vpzcb.amplifyapp.com/).

### Hyperspace FEVM smart contracts

* **Operator.sol**  [0xA65e4D8B969C8D83222A77F1c0237D3e6D5fDac2](https://hyperspace.filfox.info/en/address/0xA65e4D8B969C8D83222A77F1c0237D3e6D5fDac2)
* **EndorseCIDRegistry.sol** [0xb16bD9690eA46805735e9330FdB78cC048BfbD18](https://hyperspace.filfox.info/en/address/0xb16bD9690eA46805735e9330FdB78cC048BfbD18)
* **CID2HashRegistry.sol** [0x0813582fcd664A0a3B14ED0c2a31c0fF47Da0c21](https://hyperspace.filfox.info/en/address/0x0813582fcd664A0a3B14ED0c2a31c0fF47Da0c21)
* **CID2HashOracleLogic.sol** [0xB9cCC8AacDc8995faFC60591c4F7d3A678AD4b30](https://hyperspace.filfox.info/en/address/0xB9cCC8AacDc8995faFC60591c4F7d3A678AD4b30)

### Polygon Mumbai smart contracts

* **Operator.sol**  [0x3c72382DB6FB9410fe33f72e9e04619b6737A965](https://mumbai.polygonscan.com/address/0x3c72382db6fb9410fe33f72e9e04619b6737a965)
* **EndorseCIDRegistry.sol** [0xb16bD9690eA46805735e9330FdB78cC048BfbD18](https://mumbai.polygonscan.com/address/0xb16bD9690eA46805735e9330FdB78cC048BfbD18)
* **CID2HashRegistry.sol** [0x0813582fcd664A0a3B14ED0c2a31c0fF47Da0c21](https://mumbai.polygonscan.com/address/0x0813582fcd664A0a3B14ED0c2a31c0fF47Da0c21)
* **CID2HashOracleLogic.sol** [0xB9cCC8AacDc8995faFC60591c4F7d3A678AD4b30](https://mumbai.polygonscan.com/address/0xB9cCC8AacDc8995faFC60591c4F7d3A678AD4b30)

⚠️ FEVM is a chain currently under development. It is possible that is periodically reset, thus the addresses posted
above may not work anymore. You can always re-deploy the smart contracts on FEVM, see `contracts` readme. 
Once the FEVM will be considered production-ready, **it will be the only chain supported by this project**.

For the **Chainlink Oracle**, its Docker image is running as a serverless container in AWS (using AWS Fargate) and each verification requests is handled by a Lambda Function.

IPFS storage used via our GUI uses the SDK and functionalities of **Web3.Storage**

## Examples

You can check our [Bacalhau example](https://github.com/odfdata/wiki-ipfs/tree/master/bacalhau)

## Known limitations

Solution can be improved with the following integrations:
* use of a DID service to add trusted identities to IPFS files
* Bacalhau example will work only if you run on a node that support HTTP external calls (see https://github.com/filecoin-project/bacalhau/issues/856 )


