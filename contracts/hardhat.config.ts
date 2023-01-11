import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import secrets from './.secrets.json';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
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
    mainnetPoly: {
      url: secrets.nodeUrls.mainnetPoly,
      accounts: [secrets.privateKeys.mainnetPoly.deployer],
      gasPrice: "auto"
    },
    mumbai: {
      url: secrets.nodeUrls.mumbai,
      accounts: [secrets.privateKeys.mumbai.deployer],
      gasPrice: "auto"
    },
    wallaby: {
      chainId: 31415,
      url: "https://wallaby.node.glif.io/rpc/v0",
      accounts: [secrets.privateKeys.wallabi.deployer],
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
