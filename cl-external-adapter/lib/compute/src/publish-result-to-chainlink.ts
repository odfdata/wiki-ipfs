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

/**
 * The AWS Lambda handler called to make the API call to resume the Chainlink job paused before because the invocation
 * was in async mode.
 * @param {PublishResultToChainlinkParams} event - The event containing all the information needed to call the Chainlink
 * Node to resume the Chainlink Job paused.
 * @param {Context} context - The AWS Lambda context
 * @return {Promise<PublishResultToChainlinkResponse>} - The promise containing the information generated calling
 * the HTTP PATCH endpoint to resume the Chainlink Job.
 */
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
