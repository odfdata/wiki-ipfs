import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import secrets from './.secrets.json';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.8.17",
    },{
      version: "0.7.6",
    }],
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337,
      forking: {
        url: secrets.nodeUrls.mumbai,
        blockNumber: 29183813
      }
    },
    mumbai: {
      url: secrets.nodeUrls.mumbai,
      accounts: [secrets.privateKeys.mumbai.deployer, secrets.privateKeys.mumbai.oracleAdmin],
      gasPrice: "auto"
    },
    wallaby: {
      chainId: 31415,
      url: secrets.nodeUrls.wallaby,
      accounts: [secrets.privateKeys.wallaby.deployer, secrets.privateKeys.wallaby.oracleAdmin],
      gasPrice: "auto"
    },
  },
  etherscan: {
    apiKey: {
      polygon: secrets.polygonscanAPI,
      polygonMumbai: secrets.polygonscanAPI
    }
  }
};

export default config;
