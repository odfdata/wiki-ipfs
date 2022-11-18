/**
 * Details of the chain we can connect to
 *
 * @param {string} EXPLORER_URL - URL base of the explorer
 * @param {number} ID - id of the chain
 * @param {boolean} IS_TESTNET - true if it's a testnet, false otherwise
 */
import {AbiItem} from "web3-utils";

export interface ChainDetails {
  EXPLORER_URL: string,
  ID: number,
  IS_TESTNET: boolean
}

/**
 * Details of the contracts we want to interact with on the chain
 *
 * @param {string} CID_MATCHER_ADDRESS - sc address of the CID Matcher
 * @param {AbiItem} CID_MATCHER_ABI - ABI of the CID Matcher SC
 */
export interface ContractDetails {
  CID_MATCHER_ADDRESS: string,
  CID_MATCHER_ABI: AbiItem
}
