import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {create, } from "kubo-rpc-client";

export const lambdaHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // connect to ipfs daemon API server
  /*
  const ipfs = create({
    port: 8080,
    protocol: 'http'
  });

  ipfs.ls(`/ipfs/${event.CIDList}`)
   */
  /*
  let statusCode: number | undefined;
  let response: object | undefined;
  console.log(event.body);
  let body: object = (event.body === undefined || event.body === null) ? {} : JSON.parse(event.body);
  console.log('Body received: ', body);
  try {
    const result = await generateHash(body);
    Requester.success(
        result.jobRunID, {data: {CIDList: result.CIDList, evaluatedHashList: result.evaluatedHashList}});
    statusCode = 201;
    response = { id: result.jobRunID, data: { CIDList: result.CIDList, evaluatedHashList: result.evaluatedHashList }};
  } catch (e) {
    console.log("Try/Catch lambda handler");
    console.error(e);
    // @ts-ignore
    Requester.errored(body.id as string, {'error': 'Error generating file hash'});
    statusCode = 500;
    response = {error: 'Error generating file hash'};
  }
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  };
   */
  return {
    statusCode: 200,
    body: JSON.stringify({"pending": true})
  };
};
