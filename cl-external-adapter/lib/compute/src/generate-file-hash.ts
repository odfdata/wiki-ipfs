import {Context} from "aws-lambda";
import crypto from "crypto";
import fs from "fs";
import axios from "axios";
import {promisify} from 'util'
import * as stream from "stream";

const ipfsProtocol = process.env.IPFS_PROTOCOL as string;
const ipfsIPAddress = process.env.IPFS_IP_ADDRESS as string;
const ipfsAuthorizationHeader = process.env.IPFS_AUTHORIZATION_TOKEN as string;
const finished = promisify(stream.finished);

export interface GenerateFileHashParams {
  CID: string
}

export interface GenerateFileHashResponse {
  CID: string,
  hash: string
}

/**
 * Generate the sha-256 hash of the CID file content
 * @param {string} CID: The IPFS CID for which you want to download the content for and generate the hash
 * @return {Promise<string>} The promise containing the sha-256 hash of the file
 */
const downloadIPFSFile = async (CID: string): Promise<string> => {
  // TODO: file size limit is currently limited to 512 MB
  const writer = fs.createWriteStream(`/tmp/${CID}`);
  try {
    const response = await axios.get(
        `${ipfsProtocol}://${ipfsIPAddress}/ipfs/${CID}`,
        {
          headers: {
            Authorization: ipfsAuthorizationHeader
          },
          responseType: 'stream' });
    response.data.pipe(writer);
    await finished(writer);
  } catch (error) {
    console.log(error);
  }
  const readFile = fs.readFileSync(`/tmp/${CID}`);
  return '0x' + crypto.createHash("sha256").update(readFile).digest('hex');
}

/**
 * Lambda handler invoked by AWS Lambda to generate CID hashes
 * @param {GenerateFileHashParams} event - The event containing the CID
 * @param {Context} context - The AWS Lambda context
 * @return {Promise<GenerateFileHashResponse>} - The promise containing the evaluated hash
 */
export const lambdaHandler = async (event: GenerateFileHashParams, context: Context): Promise<GenerateFileHashResponse> => {
  const hashString = await downloadIPFSFile(event.CID);
  return {
    CID: event.CID,
    hash: hashString
  };
}
