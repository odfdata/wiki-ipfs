# Smart Contracts

These smart contracts represent the core structure of **WIKI-IPFS** project

## How to run

Contracts have been developed using the [hardhat framework](https://hardhat.org/). 

You need to create a `.secrets.json` file to run the scripts. You can just copy and renaming `.secrets.example.json` file to access al the documents.

You also need to take care at `./scripts/ProjectConstants.js` as that file contains constants that might be changed
if you want to work on a local instance of the solution.

These are the commands you need to run the scripts:
* `yarn install` to install dependencies
* `yarn hardhat compile` to compile smart contracts
* `yarn hardhat run scripts/Deployer/deployOracleOperator.ts` to deploy the Operator.sol ChainLink Smart Contract (use `--network` flag for a specific network)
* `yarn hardhat run scripts/Deployer/deployContractStructure.ts` to deploy the WIKI-IPFS core Smart Contracts (use `--network` flag for a specific network)
* `yarn hardhat test` to run tests
* `yarn hardhat verify {contract_address} "arg01" "arg02" "arg03..."` to verify the deployed smart contracts on PolygonScan

### First: deploy Oracle.sol

First of all you need to deploy the Oracle.sol smart contract, to then create a job via the ChainLink UI (see the 
dedicate section) and then proceed to the deploy of the WIKI-IPFS infrastructure.

Inside your `ProjectConstants.js` file make sure to add the correct address of the wallet that will be the 
admin of the `Oracle.sol` smart contract. At the moment it can be an empty wallet, as the deployed
transaction is paid by the `deployer` wallet defined in `.secrets.json`

You can now deploy

```bash
yarn hardhat compile
yarn hardhat run scripts/Deployer/deployOracleOperator.ts
```

Take note of the `Oracle.sol` address printed in console

### Second: deploy Wiki-IPFS infrastructure

Once you have a valid `Oracle.sol` address, report it in the `ProjectConstants.js` ( `ORACLE_ADDRESS` filed).

You can now set-up your ChainLink UI (see ChainLink docs) and generate a new **job**: take note of the `jobId` and 
report in `ProjectConstants.js` ( `JOD_ID` filed).

Finally make sure that `PAY_TOKEN_ADDRESS` (always in `ProjectConstants.js`) is correct.

You can now proceed to deploy Wiki-IPFS files

```bash
yarn hardhat compile
yarn hardhat test && yarn hardhat run scripts/Deployer/deployContractStructure.ts
```

Check the console to see the address of the deployed addresses.


## Current deployment

We're curretnly migratin to Filecoin Virtuam Machine, in their EVM-compatible version. Due to the fact that Wallaby 
testnet keeps getting resetted, it's hard to write a contract address. We'll add the deployed version once a 
permanent testnet (or mainnet) is released.

There's an old version of contracts deployed on **Polygon Mumbai** testnet (v0.1 of the Wiki-IPFS)

* **Chainlink Oracle contact** [0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c](https://mumbai.polygonscan.com/address/0xa00c397463fc7dcf8bd4227ad920a6abcb3f216c)
* **CIDMatcher contract** [0xa42761397aB5F2629d7b9e65E0c6A617f718581F](https://mumbai.polygonscan.com/address/0xa42761397aB5F2629d7b9e65E0c6A617f718581F)
