import {Context} from "aws-lambda";
import crypto from "crypto";
import fs from "fs";
import axios from "axios";
import {pipeline} from "stream";
// import wget from "node-wget-promise";

const ipfsProtocol = process.env.IPFS_PROTOCOL as string;
const ipfsIPAddress = process.env.IPFS_IP_ADDRESS as string;
const ipfsApiDownloadFilePort = parseInt(process.env.IPFS_API_DOWNLOAD_FILE_PORT as string);
const ipfsAuthorizationHeader = process.env.IPFS_AUTHORIZATION_TOKEN as string;

export interface GenerateFileHashParams {
  CID: string
}

export interface GenerateFileHashResponse {
  CID: string,
  hash: string
}

const downloadIPFSFile = async (CID: string) => {
  // TODO: file size limit is currently limited to 512 MB

  try {
    const response = await axios.get(
        `${ipfsProtocol}://${ipfsIPAddress}/ipfs/${CID}`,
        {
          headers: {
            Authorization: ipfsAuthorizationHeader
          },
          responseType: 'stream' });
    await pipeline(response.data, fs.createWriteStream(`/tmp/${CID}`));
    // const w = await response.data.pipe();
    // console.log(w);
    console.log(`File downloaded successfully : ${CID}`)
  } catch (error) {
    console.log(error);
  }
  // fs.writeFileSync(`/tmp/${CID}`, response.data);
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
  return '0x' + crypto.createHash("sha256").update(readFile).digest('hex');
}

export const lambdaHandler = async (event: GenerateFileHashParams, context: Context): Promise<GenerateFileHashResponse> => {
  const hashString = await downloadIPFSFile(event.CID);
  return {
    CID: event.CID,
    hash: hashString
  };
}


// @ts-ignore
// lambdaHandler({CID: 'bafkreibhd6ylqwdlrwmg2mu26fnw3mj6jzahsr6a3rao4gtrnghlthy2xy'}, null).then(response => console.log(response));
