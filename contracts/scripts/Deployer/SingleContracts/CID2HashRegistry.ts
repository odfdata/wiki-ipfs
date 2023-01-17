import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CID2HashRegistry} from "../../../typechain-types";

/**
 * Deploy an instance of CID2HashRegistry
 * @param signer - who's going to sign the transaction
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployCID2HashRegistry(
  signer: SignerWithAddress,
  nonce: number = -1
): Promise<CID2HashRegistry> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  let gasData = await ethers.provider.getFeeData();
  const contractFactory = await ethers.getContractFactory("CID2HashRegistry", signer);
  return await contractFactory.deploy(
    {
      nonce: next_nonce,
      maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString()
    }
  ) as CID2HashRegistry;
}


/**
 * Adds the WRITER_ROLE role to the given address
 * @param signer - who's going to sign the transaction
 * @param cid2hashRegistryAddress - address of the deployed CID2HashRegistry
 * @param writerAddress - address that will get the WRITER_ROLE
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function cid2hashRegistry_setWriterRole(
  signer: SignerWithAddress,
  cid2hashRegistryAddress: string,
  writerAddress: string,
  nonce: number = -1
): Promise<void> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  let gasData = await ethers.provider.getFeeData();
  const contractFactory = await ethers.getContractFactory("CID2HashRegistry", signer);
  await contractFactory
    .attach(cid2hashRegistryAddress)
    .grantRole(
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("WRITER_ROLE")),
      writerAddress,
      {
        nonce: next_nonce,
        maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString()
      }
    );
  return;
}
