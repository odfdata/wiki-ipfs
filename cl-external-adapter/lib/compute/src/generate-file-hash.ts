import {Context} from "aws-lambda";
import {create} from "kubo-rpc-client";
import crypto from "crypto";
import {Buffer} from "buffer";

const ipfsIPAddress = process.env.IPFS_IP_ADDRESS as string;
// connect to ipfs daemon API server
const ipfs = create({
  host: ipfsIPAddress,
  port: 8080,
  protocol: 'http'
});

export interface GenerateFileHashParams {
  CID: string
}

export interface GenerateFileHashResponse {
  CID: string,
  hash: string
}

const downloadIPFSFile = async (CID: string) => {
  const downloadFile = ipfs.get(`/ipfs/${CID}`);
  let uint8Array = new Uint8Array();
  for await (const buf of downloadFile) {
    // sum of individual array lengths
    let mergedArray = new Uint8Array(uint8Array.length + buf.length);
    mergedArray.set(uint8Array);
    mergedArray.set(buf, uint8Array.length);
    uint8Array = mergedArray;
  }
  return crypto.createHash("sha256").update(uint8Array).digest('hex');
}

export const lambdaHandler = async (event: GenerateFileHashParams, context: Context): Promise<GenerateFileHashResponse> => {
  const hashString = await downloadIPFSFile(event.CID);
  return {
    CID: event.CID,
    hash: hashString
  };
}
