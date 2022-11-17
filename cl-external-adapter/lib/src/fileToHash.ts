import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
// @ts-ignore
import {Requester, Validator} from "@chainlink/external-adapter";
import {Web3Storage} from 'web3.storage'
// @ts-ignore
import ab2str from "arraybuffer-to-string";
import crypto from "crypto";
import axios from "axios";

const chainlinkHashVerifierParams = {
  CIDList: ['CIDList'],
  endpoint: false
}

/**
 * Interface that contains the hash and the corresponding file
 * @property {string} jobRunID - The Chainlink job run ID
 * @property {string} CIDList - The CIDs from which the hashes have been generated
 * @property {string} evaluatedHashList - The list of hashes evaluated by the process
 */
interface HashGenerated {
  jobRunID: string,
  CIDList: string[],
  evaluatedHashList: string[]
}

const ipfsGatewayBaseUrl: string = "https://dweb.link/api/v0/ls";

const generateHash = async (input: any): Promise<HashGenerated> => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, chainlinkHashVerifierParams);
  const jobRunID: string = validator.validated.id;
  const CIDList: string[] = validator.validated.data.CIDList;
  const web3Storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN as string });
  const evaluatedHashList: string[] = []; const CIDListResult: string[] = [];
  for (const CID of CIDList) {
    console.log(CID);
    const ipfsResult = await axios.get(`${ipfsGatewayBaseUrl}?arg=${CID}`);
    if (ipfsResult.status !== 200) throw new Error(`CID ${CID} doesn't exist`);
    const ipfsResultJson = ipfsResult.data;
    console.log(ipfsResultJson);
    // at the moment we just manage ipfs CIDs with just one file inside
    if (ipfsResultJson.Objects[0].Links.length > 1) {
      CIDListResult.push(CID);
      evaluatedHashList.push("0x0000000000000000000000000000000000000000000000000000000000000003");
    } else {
      const res = await web3Storage.get(CID);
      if (res === null) throw new Error("Got a null response");
      console.log(`Got a response! [${res.status}] ${res.statusText}`);
      if (!res.ok) throw new Error(`failed to get ${CID}`);
      // unpack File objects from the response
      const file = (await res.files())[0];
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
      const fileBuffer = await file.arrayBuffer();
      const buf = Buffer.from(fileBuffer);
      const hashString = crypto.createHash("sha256").update(buf).digest('hex');
      console.log(hashString);
      // we store the same hash for the folder (if exists) and the file
      CIDListResult.push(file.cid);
      evaluatedHashList.push('0x' + hashString);
      if (file.cid !== CID) {
        CIDListResult.push(CID);
        evaluatedHashList.push('0x' + hashString);
      }
    }
  }
  return {jobRunID, CIDList: CIDListResult, evaluatedHashList};
}

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  let statusCode: number | undefined;
  let response: object | undefined;
  console.log(event.body);
  let body: object = (event.body === undefined || event.body === null) ? {} : JSON.parse(event.body);
  console.log('Body received: ', body);
  try {
    const result = await generateHash(body);
    Requester.success(
        result.jobRunID, {data: {CIDList: result.CIDList, evaluatedHashList: result.evaluatedHashList}});
    statusCode = 201;
    response = { id: result.jobRunID, data: { CIDList: result.CIDList, evaluatedHashList: result.evaluatedHashList }};
  } catch (e) {
    console.error(e);
    // @ts-ignore
    Requester.errored(body.id as string, {'error': 'Error generating file hash'});
    statusCode = 500;
    response = {error: 'Error generating file hash'};
  }
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  };
};
