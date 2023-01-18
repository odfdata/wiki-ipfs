import {Context} from "aws-lambda";
import axios from "axios";

export interface PublishResultToChainlinkParams {
  jobRunID: number,
  requestURL: string,
  CIDList: string[],
  hashList: string[],
}

export interface PublishResultToChainlinkResponse {
  success: boolean,
  errorMessage: string
}

export const lambdaHandler = async (
    event: PublishResultToChainlinkParams, context: Context): Promise<PublishResultToChainlinkResponse> => {

  let success = true;
  let errorMessage = '';

  try {
    await axios.patch(event.requestURL, {CIDList: event.CIDList, hashList: event.CIDList});
  } catch (e) {
    success = false;
    errorMessage = (e as Error).toString();
  }
  return {success, errorMessage};
}
