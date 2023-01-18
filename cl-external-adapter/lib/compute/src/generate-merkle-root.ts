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
  console.log('Event received: ');
  console.log(event);
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
    const leaves = event.fileHashes.map(x => x.hash);
    const tree = new MerkleTree(leaves, sha256);
    const root = tree.getRoot().toString('hex');
    const leaf = leaves[0];
    const proof = tree.getProof(leaf);
    console.log('Tree:');
    console.log(tree.toString());
    console.log('Root:');
    console.log(root.toString());
    console.log('Leaf:');
    console.log(leaf);
    console.log('Proof:');
    console.log(proof);
    console.log('Is tree verified? ' + tree.verify(proof, leaf, root)); // true
    response.hashList.push('0x' + root.toString());
  }
  return response;
}
