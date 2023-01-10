import {EventBridgeEvent, Context} from "aws-lambda";
export const lambdaHandler = async (event: EventBridgeEvent<any, any>, context: Context): Promise<void> => {

  console.log(event);

};
