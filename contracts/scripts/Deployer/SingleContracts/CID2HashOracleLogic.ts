import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CID2HashOracleLogic} from "../../../typechain-types";

/**
 * Deploy an instance of CID2HashOracleLogic
 * @param signer - who's going to sign the transaction
 * @param jobId - ID of the CL Oracle job
 * @param oracle - address of the oracle Smart Contract
 * @param payTokenAddress - address of LINK ERC-20 contract
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployCID2HashOracleLogic(
  signer: SignerWithAddress,
  jobId: string,
  oracle: string,
  payTokenAddress: string,
  nonce: number = -1
): Promise<CID2HashOracleLogic> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  const contractFactory = await ethers.getContractFactory("CID2HashOracleLogic", signer);
  return await contractFactory.deploy(
    jobId,
    oracle,
    payTokenAddress,
    { nonce: next_nonce }
  ) as CID2HashOracleLogic;
}
