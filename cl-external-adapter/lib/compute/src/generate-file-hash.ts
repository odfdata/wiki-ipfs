import {Context} from "aws-lambda";
import crypto from "crypto";
import fs from "fs";
// import axios from "axios";
import wget from "node-wget-promise";

const ipfsIPAddress = process.env.IPFS_IP_ADDRESS as string;
// connect to ipfs daemon API server
/*
const ipfs = create({
  host: ipfsIPAddress,
  port: 8080,
  protocol: 'http'
});
 */

export interface GenerateFileHashParams {
  CID: string
}

export interface GenerateFileHashResponse {
  CID: string,
  hash: string
}

const downloadIPFSFile = async (CID: string) => {
  // TODO: file size limit is currently limited to 512 MB
  // const response = await axios.get(`http://${ipfsIPAddress}:8080/ipfs/${CID}`);
  await wget(`http://${ipfsIPAddress}:8080/ipfs/${CID}`, {output: `/tmp/${CID}`});
  // const readFile = fs.readFileSync(`/tmp/${CID}`);
  /*
  const downloadFile = ipfs.cat(`/ipfs/${CID}`);
  const writableStream = fs.createWriteStream(`/tmp/${CID}`, {flags: 'w'});

  for await (const buf of downloadFile) {
    console.log(writableStream.write(buf, function (e) {
      if (e !== undefined && e !== null) console.error(e);
    }));
  }
  writableStream.close(function (e) {
    if (e !== undefined && e !== null) console.error(e);
  });
   */
  const readFile = fs.readFileSync(`/tmp/${CID}`);
  console.log(readFile.length);
  return crypto.createHash("sha256").update(readFile).digest('hex');
}

export const lambdaHandler = async (event: GenerateFileHashParams, context: Context): Promise<GenerateFileHashResponse> => {
  const hashString = await downloadIPFSFile(event.CID);
  return {
    CID: event.CID,
    hash: hashString
  };
}
