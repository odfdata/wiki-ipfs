import {SUPPORTED_CHAIN_IDs} from "../constants";
import {Chain} from "../ProjectTypes/Project.enum";
import {BigNumber} from "@ethersproject/bignumber";

/**+
 * Checks if the given chain id is among those supported by our protocol. 0 is considered valid as it means
 * no wallet are yet connected
 *
 * @param {number} chainId
 * @return {boolean} true if it's supported, false otherwise
 */
export const isSupportedChainId = (chainId: number): boolean => {
  return SUPPORTED_CHAIN_IDs.includes(chainId);
}

/**
 * Transforms a full tokenId of an NFT, into it's ID number, and the chain where it is on.
 * @param {string} tokenId - the token id as it's written on the chain
 * @return {chain: Chain, nftNum: number} - the combination of chain number and the number of NFT on that chain
 */
export const fromTokenIdToChain = (tokenId: string): { chain: Chain, nftNum: number } => {
  let tkId = BigNumber.from(tokenId);
  let chainNum = tkId.div(BigNumber.from(10).pow(50)).toNumber();
  let tokenIdNum =  tkId.sub(BigNumber.from(10).pow(50).mul(chainNum)).toNumber();
  return {
    chain: chainNum,
    nftNum: tokenIdNum
  }
}
