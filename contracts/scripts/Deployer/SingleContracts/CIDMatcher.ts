import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CIDMatcher} from "../../../typechain-types";

/**
 * Deploy an instance of CIDMatcher
 * @param signer - who's going to sign the transaction
 * @param jobId - ID of the CL Oracle job
 * @param oracle - address of the oracle Smart Contract
 * @param LINKAddress - address of LINK ERC-20 contract
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployCIDMatcher(
  signer: SignerWithAddress,
  jobId: string,
  oracle: string,
  LINKAddress: string,
  nonce: number = -1
): Promise<CIDMatcher> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  const contractFactory = await ethers.getContractFactory("CIDMatcher", signer);
  return await contractFactory.deploy(
    jobId,
    oracle,
    LINKAddress,
    { nonce: next_nonce }
  ) as CIDMatcher;
}
