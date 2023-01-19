import {AbiItem} from "web3-utils";
import {ChainDetails, ContractDetails} from "./ProjectTypes/Project.types";

export const CONTRACTS_DETAILS: {80001: ContractDetails; 3141: ContractDetails} = {
  80001: {
    CID_2_HASH_REGISTRY_ADDRESS: "0x35912ec51ED76af08311346A118047dBC1d06Fe7",
    CID_2_HASH_REGISTRY_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"CID2HashAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WRITER","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"},{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"addHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"getCIDsFromHash","outputs":[{"internalType":"string[]","name":"CIDs","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getHashFromCID","outputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"sha2ToCIDs","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}] as unknown as AbiItem,
    CID_2_HASH_ORACLE_LOGIC_ADDRESS: "0x3B558E71D2A6203D08B2FA8751d743Fa9F181Eac",
    CID_2_HASH_ORACLE_LOGIC_ABI: [{"inputs":[{"internalType":"string","name":"_jobId","type":"string"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_payToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":false,"internalType":"uint256","name":"_error","type":"uint256"}],"name":"CID2HashErrorResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"CID2HashRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"CID2HashSuccessResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"Cid2HashRegistryContract","outputs":[{"internalType":"contract CID2HashRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_CID_PER_VERIFICATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ORACLE_PAYMENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ORACLE_PAYMENT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_payment","type":"uint256"},{"internalType":"bytes4","name":"_callbackFunctionId","type":"bytes4"},{"internalType":"uint256","name":"_expiration","type":"uint256"}],"name":"cancelRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"string[]","name":"_cidList","type":"string[]"},{"internalType":"bytes32[]","name":"_hashList","type":"bytes32[]"}],"name":"fulfillRequestCIDToHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainlinkToken","outputs":[{"internalType":"address","name":"oraclePaymentTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getVerificationStatus","outputs":[{"internalType":"uint256","name":"status","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jobId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"requestCID2Hash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"setCid2HashRegistryAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_jobId","type":"string"}],"name":"setJobId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newLinkPayment","type":"uint256"}],"name":"setOraclePayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newPaymentToken","type":"address"}],"name":"setOraclePaymentTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"}] as unknown as AbiItem,
    ENDORSE_CID_REGISTRY_ADDRESS: "0xD843359f82D82306CB9d6c5FC1290a93b558AF87",
    ENDORSE_CID_REGISTRY_ABI: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Endorsed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Opposed","type":"event"},{"inputs":[],"name":"MAX_SIGN_VALIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"endorseCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"endorseCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"},{"internalType":"address","name":"_endorser","type":"address"}],"name":"endorseStatus","outputs":[{"internalType":"bool","name":"isEndorsed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"}],"name":"numberOfEndorser","outputs":[{"internalType":"uint256","name":"numberOfEndorser","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"opposeCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"opposeCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"}] as unknown as AbiItem,
  },
  3141: {
    CID_2_HASH_REGISTRY_ADDRESS: "0xe04892004FD581Ed14A8eB3C6CBf4F97394c16Dd",
    CID_2_HASH_REGISTRY_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"CID2HashAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WRITER","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"},{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"addHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"getCIDsFromHash","outputs":[{"internalType":"string[]","name":"CIDs","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getHashFromCID","outputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"sha2ToCIDs","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}] as unknown as AbiItem,
    CID_2_HASH_ORACLE_LOGIC_ADDRESS: "0xFA052A2794DC5194b3900De74D605deb12c941BB",
    CID_2_HASH_ORACLE_LOGIC_ABI: [{"inputs":[{"internalType":"string","name":"_jobId","type":"string"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_payToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":false,"internalType":"uint256","name":"_error","type":"uint256"}],"name":"CID2HashErrorResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"CID2HashRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"CID2HashSuccessResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"Cid2HashRegistryContract","outputs":[{"internalType":"contract CID2HashRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_CID_PER_VERIFICATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ORACLE_PAYMENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ORACLE_PAYMENT_TOKEN_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_payment","type":"uint256"},{"internalType":"bytes4","name":"_callbackFunctionId","type":"bytes4"},{"internalType":"uint256","name":"_expiration","type":"uint256"}],"name":"cancelRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"string[]","name":"_cidList","type":"string[]"},{"internalType":"bytes32[]","name":"_hashList","type":"bytes32[]"}],"name":"fulfillRequestCIDToHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainlinkToken","outputs":[{"internalType":"address","name":"oraclePaymentTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getVerificationStatus","outputs":[{"internalType":"uint256","name":"status","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"jobId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"requestCID2Hash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"setCid2HashRegistryAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_jobId","type":"string"}],"name":"setJobId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newLinkPayment","type":"uint256"}],"name":"setOraclePayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newPaymentToken","type":"address"}],"name":"setOraclePaymentTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"}] as unknown as AbiItem,
    ENDORSE_CID_REGISTRY_ADDRESS: "0x58Ef2EDBf4808C3ab0538eA19d5f510Fc07e4E83",
    ENDORSE_CID_REGISTRY_ABI: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Endorsed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Opposed","type":"event"},{"inputs":[],"name":"MAX_SIGN_VALIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"endorseCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"endorseCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"},{"internalType":"address","name":"_endorser","type":"address"}],"name":"endorseStatus","outputs":[{"internalType":"bool","name":"isEndorsed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"}],"name":"numberOfEndorser","outputs":[{"internalType":"uint256","name":"numberOfEndorser","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"opposeCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"opposeCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"}] as unknown as AbiItem,
  }
};
export const CHAIN_DETAILS: {80001: ChainDetails; 3141: ChainDetails} = {
  80001: {
    EXPLORER_URL: "https://mumbai.polygonscan.com/",
    ID: 80001,
    IS_TESTNET: true
  },
  3141: {
    EXPLORER_URL: "https://explorer.glif.io/?network=hyperspacenet",
    ID: 3141,
    IS_TESTNET: true
  }
};
export const IPFS_GATEWAY_BASE_URL: string = "https://gateway.ipfs.io";
