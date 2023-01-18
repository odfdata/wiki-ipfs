import {Context} from "aws-lambda";
import axios from "axios";

export interface PublishResultToChainlinkParams {
  jobRunID: number,
  responseURL: string,
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
    await axios.patch(
        event.responseURL, {value: {data: {CIDList: event.CIDList, evaluatedHashList: event.hashList}}});
  } catch (e) {
    console.error(e);
    success = false;
    errorMessage = (e as Error).toString();
  }
  return {success, errorMessage};
}
