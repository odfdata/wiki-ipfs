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
    },{
      version: "0.4.26",
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
        url: secrets.nodeUrls.hyperspace,
        blockNumber: 133429
      }
    },
    mumbai: {
      url: secrets.nodeUrls.mumbai,
      accounts: [secrets.privateKeys.mumbai.deployer],
      gasPrice: "auto"
    },
    hyperspace: {
      chainId: 3141,
      url: secrets.nodeUrls.hyperspace,
      accounts: [secrets.privateKeys.hyperspace.deployer],
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
