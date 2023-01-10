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

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event.body);
    let body: object = (event.body === undefined || event.body === null) ? {} : JSON.parse(event.body);
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(body, chainlinkHashVerifierParams);
    const jobRunID: string = validator.validated.id;
    const CIDList: string[] = validator.validated.data.CIDList;

    const eventBridgeEvent = new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify({eventName: 'CHAINLINK_REQUEST', jobRunID: jobRunID, CIDList: CIDList}),
          Resources: [
            eventBridgeBusArn
          ],
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
    }
  }
};
