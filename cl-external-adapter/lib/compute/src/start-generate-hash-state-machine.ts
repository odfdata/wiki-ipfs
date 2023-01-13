import {EventBridgeEvent, Context} from "aws-lambda";
import {SFNClient, StartExecutionCommand} from "@aws-sdk/client-sfn";

const sfnClient = new SFNClient({});
const generateHashStateMachineArn = process.env.GENERATE_HASH_STATE_MACHINE_ARN as string;
export const lambdaHandler = async (event: EventBridgeEvent<any, any>, context: Context): Promise<void> => {

  console.log(event);

  await sfnClient.send(new StartExecutionCommand({
    input: JSON.stringify({
      jobRunID: event.detail.jobRunID,
      CIDList: event.detail.CIDList,
      requestURL: event.detail.requestURL,
      publishResultToChainlink: true
    }),
    stateMachineArn: generateHashStateMachineArn
  }));
};
