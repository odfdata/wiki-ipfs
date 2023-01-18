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

First of all you need to deploy the Oracle.sol smart contract, to then create a job via the ChainLink UI (see the Readme of `cl-node`
folder) and then proceed to the deployment of the WIKI-IPFS infrastructure.

Inside your `ProjectConstants.js` file make sure to add the correct address of the wallet that will be the 
authorized sender of the `Oracle.sol` smart contract. The owner of that smart contract will be the deployer, thus 
the wallet capable of adding other `senders` (See Chainlink docs for more references).

You can now deploy

```bash
yarn hardhat compile
yarn hardhat run scripts/Deployer/deployOracleOperator.ts
```

Take note of the `Oracle.sol` address printed in console

### Second: deploy Wiki-IPFS infrastructure

Once you have a valid `Oracle.sol` address, report it in the `ProjectConstants.js` ( `ORACLE_ADDRESS` filed).

You can now set up your ChainLink UI (see ChainLink docs) and generate a new **job**: take note of the `jobId` and 
report in `ProjectConstants.js` ( `JOD_ID` filed).

Finally, make sure that `PAY_TOKEN_ADDRESS` (in `ProjectConstants.js`) is correct. 
Ideally that should be the `LNK` token ERC-20 address on the chain you're deploying to. 
If the chain doesn't have an official `LNK` token, you can deploy a generic ERC-20 token and 

You can now proceed to deploy Wiki-IPFS files

```bash
yarn hardhat compile
yarn hardhat test && yarn hardhat run scripts/Deployer/deployContractStructure.ts
```

Check the console to see the address of the deployed addresses.


## Current deployment

We're currently migrating to Filecoin Virtual Machine, in their EVM-compatible version. Due to the fact that Wallaby 
testnet keeps getting reset, it's hard to write a contract address. We'll add the deployed version once a 
permanent testnet (or mainnet) is released.

There's a version of contracts deployed on **Polygon Mumbai** testnet

* **Operator.sol**  [0x3c72382DB6FB9410fe33f72e9e04619b6737A965](https://mumbai.polygonscan.com/address/0x3c72382db6fb9410fe33f72e9e04619b6737a965)
* **EndorseCIDRegistry.sol** [0xD843359f82D82306CB9d6c5FC1290a93b558AF87](https://mumbai.polygonscan.com/address/0xd843359f82d82306cb9d6c5fc1290a93b558af87)
* **CID2HashRegistry.sol** [0x35912ec51ED76af08311346A118047dBC1d06Fe7](https://mumbai.polygonscan.com/address/0x35912ec51ed76af08311346a118047dbc1d06fe7)
* **CID2HashOracleLogic.sol** [0x3B558E71D2A6203D08B2FA8751d743Fa9F181Eac](https://mumbai.polygonscan.com/address/0x3b558e71d2a6203d08b2fa8751d743fa9f181eac)
