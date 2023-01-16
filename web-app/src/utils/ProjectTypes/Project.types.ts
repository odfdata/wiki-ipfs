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
 * @param {string} CID_2_HASH_REGISTRY_ADDRESS - sc address of the Cid2Hash Registry
 * @param {AbiItem} CID_2_HASH_REGISTRY_ABI - ABI of the Cid2Hash Registry
 * @param {string} CID_2_HASH_ORACLE_LOGIC_ADDRESS - sc address of the Cid2Hash Oracle Logic
 * @param {AbiItem} CID_2_HASH_ORACLE_LOGIC_ABI - ABI of the Cid2Hash Oracle Logic
 * @param {string} ENDORSE_CID_REGISTRY_ADDRESS - sc address of the Endorse Cid Registry
 * @param {AbiItem} ENDORSE_CID_REGISTRY_ABI - ABI of the Endorse Cid Registry
 */
export interface ContractDetails {
  CID_2_HASH_REGISTRY_ADDRESS: string,
  CID_2_HASH_REGISTRY_ABI: AbiItem,
  CID_2_HASH_ORACLE_LOGIC_ADDRESS: string,
  CID_2_HASH_ORACLE_LOGIC_ABI: AbiItem,
  ENDORSE_CID_REGISTRY_ADDRESS: string,
  ENDORSE_CID_REGISTRY_ABI: AbiItem,
}
