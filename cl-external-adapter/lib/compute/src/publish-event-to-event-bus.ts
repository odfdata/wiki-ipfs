import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
// @ts-ignore
import {Requester, Validator} from "@chainlink/external-adapter";
import {EventBridgeClient, PutEventsCommand} from "@aws-sdk/client-eventbridge";

const eventBridgeClient = new EventBridgeClient({});
const eventBridgeBusArn: string = process.env.EVENT_BRIDGE_BUS_ARN as string;

const chainlinkHashVerifierParams = {
  CIDList: ['CIDList'],
  endpoint: false
}

/**
 * The lambda handler invoked once the Chainlink Job calls the bridge to generate hashes. It's responsible for
 * sending the information in a custom EventBridge Bus.
 *
 * @param {APIGatewayEvent} event - The API gateway event received. Inside the body parameter is present the information
 * sent from the Chainlink Job
 * @param {Context} context - The AWS lambda context
 * @return {Promise<APIGatewayProxyResult>} - The API gateway proxy result containing the body to be sent to the
 * Chainlink Node to pause the Job execution.
 */
export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event.body);
    console.log(eventBridgeBusArn);
    let body: object = (event.body === undefined || event.body === null) ? {} : JSON.parse(event.body);
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(body, chainlinkHashVerifierParams);
    console.log(validator);
    const jobRunID: string = validator.validated.id;
    const CIDList: string[] = validator.validated.data.CIDList;
    const responseURL: string = validator.input.responseURL;

    const eventBridgeEvent = new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify({
            eventName: 'CHAINLINK_REQUEST',
            jobRunID: jobRunID,
            CIDList: CIDList,
            responseURL: responseURL
          }),
          EventBusName: eventBridgeBusArn,
          DetailType: "oracleRequestReceived",
          Source: "com.wikiipfs.oracle"
        }
      ]
    });
    await eventBridgeClient.send(eventBridgeEvent);
    return {
      statusCode: 200,
      body: JSON.stringify({"pending": true})
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 200,
      body: JSON.stringify({"error": "something went wrong"})
    };
  }
};
