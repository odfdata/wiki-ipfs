import fs from "fs";
import crypto, {createHash} from "crypto";
import {ethers} from "ethers";
import Web3 from "web3";

export interface FileResult {
  CID: string,
  hash: string,
  owner: string,
  verifiedOwner: boolean
}

const w3 = new Web3(process.env.MUMBAI_PROVIDER as string);
const walletAddressOwner: string = "0xcE753dC5D21fcDF4be528ce5f8f12898990BAca0";
const CIDMatcherAbi = [{"inputs":[{"internalType":"string","name":"_jobId","type":"string"},{"internalType":"address","name":"_oracle","type":"address"},{"internalType":"address","name":"_LINKAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"NewHashRecorded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"NewIPFSHashRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"ORACLE_PAYMENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_payment","type":"uint256"},{"internalType":"bytes4","name":"_callbackFunctionId","type":"bytes4"},{"internalType":"uint256","name":"_expiration","type":"uint256"}],"name":"cancelRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"string[]","name":"_cidList","type":"string[]"},{"internalType":"bytes32[]","name":"_hashList","type":"bytes32[]"}],"name":"fulfillRequestIpfsToHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"getCIDsFromHash","outputs":[{"internalType":"string[]","name":"CIDs","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getChainlinkToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getHashFromCID","outputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getOwnerOfCID","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getVerificationStatus","outputs":[{"internalType":"uint256","name":"status","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_jobId","type":"string"}],"name":"setJobId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newLinkPayment","type":"uint256"}],"name":"setOraclePayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"sha2ToCIDs","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_cidList","type":"string[]"}],"name":"storeHashGivenIpfs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawLink","outputs":[],"stateMutability":"nonpayable","type":"function"}];

fs.readdir("/inputs", (err, files) => {
  // Check input
  if (err !== null) {
    console.error("Could not read input from CID");
    console.error(err);
    return;
  }
  new Promise (async (resolve, reject) => {
    const contract = await new ethers.Contract(
        "0x553DcF1b90F0bF964219aC430C547822456EB287", CIDMatcherAbi, w3.givenProvider);
    const result: FileResult[] = [];
    // for each file, generate the hash
    for (const fileName of files) {
      const content = fs.readFileSync(`/inputs/${fileName}`);
      const hashSum = createHash('sha256');
      hashSum.update(content);
      const hash = "0x" + hashSum.digest('hex');
      // get the list of CIDs associated with the hash stored on-chain
      const CIDList: string[] = await contract.getCIDsFromHash(hash)
      let CIDresult: string = "";
      let owner: string = "";
      let verifiedOwner: boolean = false;
      for (const CID of CIDList) {
        // for each CID, get the owner from the chain
        const ownerFromChain = await contract.getOwnerOfCID([fileName]);
        if (ownerFromChain === walletAddressOwner) {
          CIDresult = CID;
          owner = ownerFromChain;
          verifiedOwner = true;
          break;
        }
      }
      result.push({
        CID: CIDresult,
        hash: hash,
        owner: owner,
        verifiedOwner: verifiedOwner
      });
    }
    fs.writeFileSync(`/outputs/${crypto.randomBytes(10).toString('hex')}`, JSON.stringify(result));
  }).then(() => {});
});
