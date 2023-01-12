import {Context} from "aws-lambda";
import {create} from "kubo-rpc-client";
import {CIDType} from "./utils/cid-utils";

const ipfsIPAddress = process.env.IPFS_IP_ADDRESS as string;
// connect to ipfs daemon API server
const ipfs = create({
  host: ipfsIPAddress,
  port: 8080,
  protocol: 'http'
});

export interface GetAllCIDsParams {
  CIDList: string[]
}

export interface SchemaObjResponse {
  CIDType: CIDType,
  CID: string
}

export interface GetAllCIDsResponse {
  masterCID: string,
  masterCIDType: CIDType,
  numFiles: string,
  schema: SchemaObjResponse[],
  filesCIDs: string[]
}

const getIPFSSchema = async (CID: string): Promise<SchemaObjResponse[]> => {
  console.log(`Getting IPFS Schema for CID ${CID}`);
  let ipfsSchema: SchemaObjResponse[] = [];
  try {
    const ipfsLsResponse = ipfs.ls(`/ipfs/${CID}`);
    for await (const ipfsEntry of ipfsLsResponse) {
      console.log(ipfsEntry.cid.toString());
      const schemaObj: SchemaObjResponse = {
        CID: ipfsEntry.cid.toString(),
        CIDType: ipfsEntry.type === "dir" ? CIDType.FOLDER : CIDType.FILE
      }
      ipfsSchema.push(schemaObj);
      if (schemaObj.CIDType === CIDType.FOLDER) {
        console.log(`Found CID ${schemaObj.CID} which is a folder`);
        ipfsSchema = [...ipfsSchema, ...(await getIPFSSchema(schemaObj.CID))];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return ipfsSchema;
}

const getCIDFilesFromIPFSSchema = (ipfsSchema: SchemaObjResponse[]): string[] => {
  const ipfsFiles = ipfsSchema.filter(is => { return is.CIDType === CIDType.FILE});
  return ipfsFiles.map(is => {return is.CID});
}

export const lambdaHandler = async (event: GetAllCIDsParams, context: Context): Promise<GetAllCIDsResponse> => {
  console.log(event);
  if (event.CIDList === undefined || event.CIDList.length === 0) throw new Error("Parameter CIDList not set");
  console.log(typeof event.CIDList);
  const ipfsSchema = await getIPFSSchema(event.CIDList[0]);
  const filesCIDs = getCIDFilesFromIPFSSchema(ipfsSchema);
  console.log(event.CIDList[0]);
  return {
    masterCID: event.CIDList[0],
    masterCIDType: CIDType.FOLDER,
    numFiles: filesCIDs.length > 1 ? 'multiple' : 'single',
    filesCIDs: filesCIDs,
    schema: ipfsSchema
  };
};

// @ts-ignore
// lambdaHandler({CID: 'QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq'}, null).then((result) => { console.log(result)});
// lambdaHandler({CID: 'QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D'}, null).then((result) => { console.log(result)});
