import {ethers, network} from "hardhat";
import {EndorseCIDRegistry, Operator} from "../../typechain-types";
import {CHAIN_CONSTANTS} from "../ProjectConstants";
import {string} from "hardhat/internal/core/params/argumentTypes";
import {deployOperator, setAuthorizedSender} from "./SingleContracts/ChainLinkOracle/Operator";
import secrets from './../../.secrets.json';
import {deployLNK} from "./SingleContracts/ChainLinkOracle/SampleLNK";

/**
 * Deploy an instance of a fake Generic ERC-20 and return its address
 * @return the address of the deployed ERC-20 token
 */
export const deploySampleLNK = async ( ): Promise<string> => {
  const [owner] = await ethers.getSigners();

  // get the next nonce
  let next_nonce = await owner.getTransactionCount();

  const genericErc20 = await deployLNK(owner, next_nonce);
  console.log(`SampleLNK.sol has been deployed at address ${genericErc20.address}`);

  return genericErc20.address;
}

if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "3141" | "1337" = network.config.chainId?.toString() as "80001" | "3141" | "1337";
  console.log("Deploying on chain " + chainId);
  deploySampleLNK()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
