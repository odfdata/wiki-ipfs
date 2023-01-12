import {Context} from "aws-lambda";
import {CIDType} from "./utils/cid-utils";
import {MerkleTree} from "merkletreejs";
import sha256 from "crypto-js/sha256.js";

export interface GenerateMerkleRootParams {
  masterCID: string,
  masterCIDType: CIDType,
  numFiles: string,
  fileHashes: {CID: string, hash: string}[]

}

export interface GenerateMerkleRootResponse {
  CIDList: string[],
  hashList: string[]
}

export const lambdaHandler = async (
    event: GenerateMerkleRootParams, context: Context): Promise<GenerateMerkleRootResponse> => {

  // check if the masterCIDType is equal to CIDType.FOLDER fileHashes.length === 1 --> same hash for CID folder and CID file
  // check if the masterCIDType is equal to CIDType.FILE --> 1 hash
  // check if the masterCIDType is equal to CIDType.FOLDER and fileHashes.length > 1 --> merkle root
  const response: GenerateMerkleRootResponse = {CIDList: [], hashList: []};
  if (event.masterCIDType === CIDType.FOLDER && event.fileHashes.length === 1) {
    // same hash for masterCID and fileCID (1 folder with just 1 file inside)
    response.CIDList.push(event.masterCID);
    response.hashList.push(event.fileHashes[0].hash);
    response.CIDList.push(event.fileHashes[0].CID);
    response.hashList.push(event.fileHashes[0].hash);
  } else if (event.masterCIDType === CIDType.FILE) {
    // hash generated for the CIDFile
    response.CIDList.push(event.fileHashes[0].CID);
    response.hashList.push(event.fileHashes[0].hash);
  } else {
    // generate merkle root, we have 1 folder with more than 1 file inside
    response.CIDList.push(event.masterCID);
    console.log(event.fileHashes.map(x => x.hash).map(x => sha256(x)));
    const leaves = event.fileHashes.map(x => x.hash);
    console.log(leaves);
    const tree = new MerkleTree(leaves, sha256);
    const root = tree.getRoot().toString('hex');
    const leaf = sha256(leaves[0]).toString();
    const proof = tree.getProof(leaf)
    console.log(tree.verify(proof, leaf, root)) // true
  }
  return response;
}
