import {ethers} from "hardhat";
import {CHAIN_CONSTANTS} from "../ProjectConstants";
import {deployEndorseCIDRegistry} from "./SingleContracts/EndorseCIDRegistry";
import {CID2HashOracleLogic, CID2HashRegistry, EndorseCIDRegistry} from "../../typechain-types";
import {cid2hashRegistry_setWriterRole, deployCID2HashRegistry} from "./SingleContracts/CID2HashRegistry";
import {
  cid2hashOracleLogic_setCid2HashRegistryAddress,
  deployCID2HashOracleLogic
} from "./SingleContracts/CID2HashOracleLogic";

/**
 * Function to deploy all the contracts on a new chain. We've used a dedicate function, so that we can call it
 * also during testing
 *
 * @param {string} jobId - id of the Chainlink JobId to certify the match between URL and hash
 * @param {string} oracleAddress - SC ChainLink Oracle address
 * @param {string} payTokenAddress - payment token ERC-20 address
 * @param {boolean} [withLogs] - true if we want to print the logs, false otherwise
 */
export const deploy = async (
  jobId: string,
  oracleAddress: string,
  payTokenAddress: string,
  withLogs: boolean = true
): Promise<{
  endorseCIDRegistry: EndorseCIDRegistry,
  CID2HashRegistry: CID2HashRegistry,
  CID2HashOracleLogic: CID2HashOracleLogic
}> => {

  // We get the contract to deploy
  const [owner] = await ethers.getSigners();

  // get the next nouce
  let next_nonce = await owner.getTransactionCount();

  const endorseCIDRegistry = await deployEndorseCIDRegistry(owner, next_nonce);
  if (withLogs)
    console.log("endorseCIDRegistry deployed - " + endorseCIDRegistry.address);

  const CID2HashRegistry = await deployCID2HashRegistry(owner, ++next_nonce);
  if (withLogs)
    console.log("CID2HashRegistry deployed - " + CID2HashRegistry.address);

  const CID2HashOracleLogic = await deployCID2HashOracleLogic(owner, jobId, oracleAddress, payTokenAddress, ++next_nonce);
  if (withLogs)
    console.log("CID2HashOracleLogic deployed - " + CID2HashOracleLogic.address);

  await cid2hashRegistry_setWriterRole(owner, CID2HashRegistry.address, CID2HashOracleLogic.address, ++next_nonce);
  if (withLogs)
    console.log("WRITER_ROLE granted to CID2HashOracleLogic inside CID2HashRegistry");

  await cid2hashOracleLogic_setCid2HashRegistryAddress(owner, CID2HashOracleLogic.address, CID2HashRegistry.address, ++next_nonce);
  if (withLogs)
    console.log("CID2HashRegistry address recorded inside the CID2HashOracleLogic");

  return { endorseCIDRegistry, CID2HashRegistry, CID2HashOracleLogic }
}


if (typeof require !== 'undefined' && require.main === module) {
  let chainId: "80001" | "31415" | "1337" = "31415";
  deploy(
    CHAIN_CONSTANTS[chainId].JOD_ID,
    CHAIN_CONSTANTS[chainId].ORACLE_ADDRESS,
    CHAIN_CONSTANTS[chainId].PAY_TOKEN_ADDRESS
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}



