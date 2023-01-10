import {aws_events as events} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ConstructProps} from "../utils/construct-props";

export interface ApplicationIntegrationProps extends ConstructProps { }

export class ApplicationIntegrationConstruct extends Construct {

  public readonly eventBus: events.EventBus;
  constructor(scope: Construct, id: string, props: ApplicationIntegrationProps) {
    super(scope, id);
    // create a new Event Bridge Bus in which the AWS Lambda function send events about chainlink jobs to be executed
    this.eventBus = new events.EventBus(
        this,
        'WikiIPFSEventBus',
        {
          eventBusName: `${props.environment}-wiki-ipfs-event-bus`
        }
    );
  }
}
