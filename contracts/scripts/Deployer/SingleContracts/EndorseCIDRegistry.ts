import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {EndorseCIDRegistry} from "../../../typechain-types";

/**
 * Deploy an instance of CID2HashRegistry
 * @param signer - who's going to sign the transaction
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployEndorseCIDRegistry(
  signer: SignerWithAddress,
  nonce: number = -1
): Promise<EndorseCIDRegistry> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  const contractFactory = await ethers.getContractFactory("EndorseCIDRegistry", signer);
  return await contractFactory.deploy(
    { nonce: next_nonce }
  ) as EndorseCIDRegistry;
}