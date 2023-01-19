import {Context, EventBridgeEvent} from "aws-lambda";
import {SFNClient, StartExecutionCommand} from "@aws-sdk/client-sfn";

const sfnClient = new SFNClient({});
const generateHashStateMachineArn = process.env.GENERATE_HASH_STATE_MACHINE_ARN as string;

/**
 * The AWS lambda handler invoked each time a custom event is received by the EventBridge custom bus. This function is
 * subscribed to all the events published once a Chainlink Bridge invocation is made.
 * @param {EventBridgeEvent} event - The EventBridge custom event which this lambda function is subscribed for
 * @param {Context} context - The AWS lambda context
 */
export const lambdaHandler = async (event: EventBridgeEvent<any, any>, context: Context): Promise<void> => {

  console.log(event);

  await sfnClient.send(new StartExecutionCommand({
    input: JSON.stringify({
      jobRunID: event.detail.jobRunID,
      CIDList: event.detail.CIDList,
      responseURL: event.detail.responseURL,
      publishResultToChainlink: true
    }),
    stateMachineArn: generateHashStateMachineArn
  }));
};
