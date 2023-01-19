import {ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Operator} from "../../../../typechain-types";

/**
 * Deploy an instance of chainlink Operator SC
 * @param signer - who's going to sign the transaction
 * @param linkTokenAddress - link of the ERC20 token
 * @param ownerAddress - the owner of the SC, i.e. the wallet that can callback to fulfill the requests
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function deployOperator(
  signer: SignerWithAddress,
  linkTokenAddress: string,
  ownerAddress: string,
  nonce: number = -1
): Promise<Operator> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  let gasData = await ethers.provider.getFeeData();
  const contractFactory = await ethers.getContractFactory("Operator", signer);
  return await contractFactory.deploy(
    linkTokenAddress,
    ownerAddress,
    {
      nonce: next_nonce,
      maxPriorityFeePerGas: ethers.provider.network.chainId === 3141 ? gasData.maxPriorityFeePerGas?.toHexString() : undefined
    }
  ) as Operator;
}

/**
 * Sets the authorized sender to the Operatos.sol contract
 * @param signer - who's going to sign the transaction
 * @param operatorAddress - the address of the deployed Operator.sol
 * @param authorizedSenderAddress - the address of the authorized sender
 * @param [nonce] - if we want to pass a nonce, rather than having the code to evaluate it
 */
export async function setAuthorizedSender(
  signer: SignerWithAddress,
  operatorAddress: string,
  authorizedSenderAddress: string,
  nonce: number = -1
): Promise<void> {
  let next_nonce = nonce >= 0 ? nonce : await signer.getTransactionCount();
  let gasData = await ethers.provider.getFeeData();
  const contractFactory = await ethers.getContractFactory("Operator", signer);
  await contractFactory
    .attach(operatorAddress)
    .setAuthorizedSenders(
      [authorizedSenderAddress],
      {
        nonce: next_nonce,
        maxPriorityFeePerGas: ethers.provider.network.chainId === 3141 ? gasData.maxPriorityFeePerGas?.toHexString() : undefined
      }
    );
  return;
}
