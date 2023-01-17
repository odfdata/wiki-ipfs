import {ethers} from "hardhat";
import {EndorseCIDRegistry, Operator} from "../../typechain-types";
import {CHAIN_CONSTANTS} from "../ProjectConstants";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {deployOperator} from "./SingleContracts/ChainLinkOracle/Operator";
import secrets from './../../.secrets.json';

/**
 * Deploy an instance of Oracle.sol and return its address
 * @param {string} payTokenAddress - the address of the ERC-20 token to pay for the oracle
 * @param {string} oracleAdminAddress - the address of wallet that is the admin of the oracle
 * @return the address of the deployed Operator.sol
 */
export const deployOracle = async (
  payTokenAddress: string,
  oracleAdminAddress: string
): Promise<string> => {
  const [owner] = await ethers.getSigners();
  const operator = await deployOperator(owner, payTokenAddress, oracleAdminAddress);
  console.log(`Operator.sol has been deployed at address ${operator.address}`);
  return operator.address;
}

if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "31415" | "1337" = "31415";
  deployOracle(
    CHAIN_CONSTANTS[chainId].PAY_TOKEN_ADDRESS,
    CHAIN_CONSTANTS[chainId].ORACLE_ADMIN_ADDRESS
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}