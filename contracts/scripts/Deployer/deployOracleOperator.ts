import {ethers} from "hardhat";
import {EndorseCIDRegistry, Operator} from "../../typechain-types";
import {CHAIN_CONSTANTS} from "../ProjectConstants";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {deployOperator, setAuthorizedSender} from "./SingleContracts/ChainLinkOracle/Operator";
import secrets from './../../.secrets.json';

/**
 * Deploy an instance of Oracle.sol and return its address
 * @param {string} payTokenAddress - the address of the ERC-20 token to pay for the oracle
 * @param {string} oracleAuthorizedSenderAddress - the address of wallet that is set as the authorized sender to fulfill requirements
 * @return the address of the deployed Operator.sol
 */
export const deployOracle = async (
  payTokenAddress: string,
  oracleAuthorizedSenderAddress: string
): Promise<string> => {
  const [owner] = await ethers.getSigners();

  // get the next nonce
  let next_nonce = await owner.getTransactionCount();

  const operator = await deployOperator(owner, payTokenAddress, owner.address, next_nonce);
  console.log(`Operator.sol has been deployed at address ${operator.address}`);

  // set authorized sender
  await setAuthorizedSender(owner, operator.address, oracleAuthorizedSenderAddress, ++next_nonce);
  console.log(`Address ${oracleAuthorizedSenderAddress} has been set as an Authorized Sender`);

  return operator.address;
}

if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "3141" | "1337" = "3141";
  deployOracle(
    CHAIN_CONSTANTS[chainId].PAY_TOKEN_ADDRESS,
    CHAIN_CONSTANTS[chainId].ORACLE_AUTHORIZED_SENDER_ADDRESS
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
