import {ethers} from "hardhat";
import {deployCIDMatcher} from "./SingleContracts/CIDMatcher";
import {CIDMatcher} from "../../typechain-types";
import {CHAIN_CONSTANTS} from "../ProjectConstants";

/**
 * Function to deploy all the contracts on a new chain. We've used a dedicate function, so that we can call it
 * also during testing
 *
 * @param {string} jobId - id of the Chainlink JobId to certify the match between URL and hash
 * @param {string} oracleAddress - SC ChainLink Oracle address
 * @param {string} linkErc20Address - LINK token ERC-20 address
 */
export const deploy = async (
  jobId: string,
  oracleAddress: string,
  linkErc20Address: string
): Promise<{
  cidMatcher: CIDMatcher
}> => {

  // We get the contract to deploy
  const [owner] = await ethers.getSigners();

  // get the next nouce
  let next_nonce = await owner.getTransactionCount();

  const cidMatcher = await deployCIDMatcher(owner, jobId,
    oracleAddress, linkErc20Address, next_nonce);
  console.log("cidMatcher deployed - " + cidMatcher.address);

  return { cidMatcher }
}


if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "137" | "1337" = "80001";
  deploy(
    CHAIN_CONSTANTS[chainId].JOD_ID,
    CHAIN_CONSTANTS[chainId].ORACLE_ADDRESS,
    CHAIN_CONSTANTS[chainId].LINK_ERC20_ADDRESS
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}



