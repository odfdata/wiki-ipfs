import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ERC20, LinkToken, Operator} from "../../../../typechain-types";

/**
 * Deploy an instance of SampleLNK.sol contract
 * @param signer - who's going to sign the transaction
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployLNK(
  signer: SignerWithAddress,
  nonce: number = -1
): Promise<LinkToken> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  let gasData = await ethers.provider.getFeeData();
  const contractFactory = await ethers.getContractFactory("LinkToken", signer);
  let contract = await contractFactory.deploy(
    {
      nonce: next_nonce,
      maxPriorityFeePerGas: ethers.provider.network.chainId === 3141 ? gasData.maxPriorityFeePerGas?.toHexString() : undefined
    }
  ) as LinkToken;
  await contract.deployed();
  return contract;
}
