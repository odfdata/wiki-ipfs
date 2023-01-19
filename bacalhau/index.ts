import fs from "fs";
import crypto, {createHash} from "crypto";
import {ethers} from "ethers";

export interface FileResult {
  CID: string,
  hash: string,
  owner: string,
  verifiedOwner: boolean
}

const w3 = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_PROVIDER as string);
const walletAddressOwner: string = "0xcE753dC5D21fcDF4be528ce5f8f12898990BAca0";
const CID2HashRegistryABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_cid","type":"string"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"CID2HashAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WRITER","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"},{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"addHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"getCIDsFromHash","outputs":[{"internalType":"string[]","name":"CIDs","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"getHashFromCID","outputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"sha2ToCIDs","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
const EndorseCidABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Endorsed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":false,"internalType":"string","name":"_CID","type":"string"},{"indexed":false,"internalType":"bool","name":"_withSign","type":"bool"}],"name":"Opposed","type":"event"},{"inputs":[],"name":"MAX_SIGN_VALIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"endorseCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"endorseCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"},{"internalType":"address","name":"_endorser","type":"address"}],"name":"endorseStatus","outputs":[{"internalType":"bool","name":"isEndorsed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_CID","type":"string"}],"name":"numberOfEndorser","outputs":[{"internalType":"uint256","name":"numberOfEndorser","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"}],"name":"opposeCID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"_CID","type":"string[]"},{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_validAfter","type":"uint256"},{"internalType":"uint256","name":"_validBefore","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"opposeCIDWithSign","outputs":[],"stateMutability":"nonpayable","type":"function"}];

fs.readdir("/inputs", (err, files) => {
  // Check input
  if (err !== null) {
    console.error("Could not read input from CID");
    console.error(err);
    return;
  }
  new Promise (async (resolve, reject) => {
    const cid2hashRegistryContract = await new ethers.Contract(
      process.env.CID_2_HASH_REGISTRY_ADDRESS, CID2HashRegistryABI, w3);
    const endorseCidContract = await new ethers.Contract(
      process.env.ENDORSE_CID_ADDRESS, EndorseCidABI, w3);
    const result: FileResult[] = [];
    // for each file, generate the hash
    for (const fileName of files) {
      const content = fs.readFileSync(`/inputs/${fileName}`);
      const hashSum = createHash('sha256');
      hashSum.update(content);
      const hash = "0x" + hashSum.digest('hex');
      // get the list of CIDs associated with the hash stored on-chain
      const CIDList: string[] = await cid2hashRegistryContract.getCIDsFromHash(hash);
      let CIDresult: string = "";
      let owner: string = "";
      let verifiedOwner: boolean = false;
      for (const CID of CIDList) {
        // for each CID, get the owner from the chain
        const isEndorsed = await endorseCidContract.endorseStatus(CID, walletAddressOwner);
        if (isEndorsed) {
          CIDresult = CID;
          verifiedOwner = true;
          break;
        } else throw new Error("CID not endorsed");
      }
      result.push({
        CID: CIDresult,
        hash: hash,
        owner: walletAddressOwner,
        verifiedOwner: verifiedOwner
      });
    }
    fs.writeFileSync(`/outputs/${crypto.randomBytes(10).toString('hex')}`, JSON.stringify(result));
  }).then(() => {});
});
