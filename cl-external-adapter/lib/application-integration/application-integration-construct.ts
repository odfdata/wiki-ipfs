import {aws_events as events} from "aws-cdk-lib";
import {Construct} from "constructs";

export class ApplicationIntegrationConstruct extends Construct {

  public readonly eventBus: events.EventBus;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // create a new Event Bridge Bus in which the AWS Lambda function send events about chainlink jobs to be executed
    this.eventBus = new events.EventBus(
        this,
        "WikiIPFSEventBus",
        {
          eventBusName: "wiki-ipfs-event-bus"
        }
    );
  }
}
