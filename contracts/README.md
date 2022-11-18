# Smart Contracts

These smart contracts are connected with the **WIKI IPFS** project for the ChainLink Fall Hackaton 22

## How to run

Contracts have been developed using the [hardhat framework](https://hardhat.org/). 

You need to create a `.secrets.json` file to run the scripts. You can just copy and renaming `.secrets.example.json` file to access al the documents.

These are the commands you need to run the scripts:
* `yarn install` to install dependencies
* `yarn hardhat compile` to compile smart contracts
* `yarn hardhat run scripts/Deployer/deploy.ts` to deploy the Smart Contract (use `--network` flag for a specific network)
* `yarn hardhat test` to run basic tests
* `yarn hardhat verify {contract_address} "arg01" "arg02" "arg03..."` to verify the deployed smart contracts on PolygonScan

## Current deployment

Contracts are currently deployed on **Polygon Mumbai** testnet

* **Chainlink Oracle contact** [0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c](https://mumbai.polygonscan.com/address/0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c)
* **CIDMatcher contract** [0xa42761397aB5F2629d7b9e65E0c6A617f718581F](https://mumbai.polygonscan.com/address/0xa42761397aB5F2629d7b9e65E0c6A617f718581F)

## Possible improvements

* Make sure that if a file is written twice, references to same CID is not written twice
* Integrate PolygonID (or any other DID), to connect a trusted ID to an IPFS link
* Make the contract upgradable
