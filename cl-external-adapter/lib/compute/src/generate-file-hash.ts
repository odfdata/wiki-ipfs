import {Context} from "aws-lambda";
import {GetAllCIDsParams, GetAllCIDsResponse} from "./get-all-cids";

export interface GenerateFileHashParams {
  CID: string
}

export interface GenerateFileHashResponse {
  CID: string,
  hash: string
}

export const lambdaHandler = async (event: GenerateFileHashParams, context: Context): Promise<GenerateFileHashResponse> => {

  return {
    CID: event.CID,
    hash: ''
  };
}
