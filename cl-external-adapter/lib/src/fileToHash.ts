import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
// @ts-ignore
import {Requester, Validator} from "@chainlink/external-adapter";
import { Web3Storage } from 'web3.storage'
// @ts-ignore
import ab2str from "arraybuffer-to-string";

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

const generateHash = async (input: any): Promise<HashGenerated> => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, chainlinkHashVerifierParams);
  const jobRunID: string = validator.validated.id;
  const CIDList: string[] = validator.validated.data.CIDList;
  const web3Storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN as string });
  const evaluatedHashList: string[] = [];
  for (const CID of CIDList) {
    console.log(CID);
    const res = await web3Storage.get(CID);
    if (res === null) throw new Error("Got a null response");
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) throw new Error(`failed to get ${CID}`);
    // unpack File objects from the response
    const files = await res.files();
    for (const file of files) {// console.log(hash);
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`)
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
      const hashString = ab2str(hashBuffer, "hex");
      console.log(hashString);
      evaluatedHashList.push('0x' + hashString);
    }
  }
  return {jobRunID, CIDList, evaluatedHashList};
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
