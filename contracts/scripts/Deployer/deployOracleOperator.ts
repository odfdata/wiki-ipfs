import {ethers} from "hardhat";
import {EndorseCIDRegistry, Operator} from "../../typechain-types";
import {CHAIN_CONSTANTS} from "../ProjectConstants";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {deployOperator} from "./SingleContracts/ChainLinkOracle/Operator";

/**
 * Deploy an instance of Oracle.sol and return its address
 * @param {string} payTokenAddress - the address of the ERC-20 token to pay for the oracle
 * @return the address of the deployed Operator.sol
 */
export const deployOracle = async (
  payTokenAddress: string
): Promise<string> => {
  const [owner, oracleAdmin] = await ethers.getSigners();
  const operator = await deployOperator(owner, payTokenAddress, oracleAdmin.address);
  console.log(`Operator.sol has been deployed at address ${operator.address}`);
  return operator.address;
}

if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "31415" | "1337" = "31415";
  deployOracle(
    CHAIN_CONSTANTS[chainId].PAY_TOKEN_ADDRESS
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
