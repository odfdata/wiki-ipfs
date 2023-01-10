import {
  Stack,
  StackProps,
  Duration,
  aws_events as events,
  aws_lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  aws_events_targets as events_targets,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";
import {ApplicationIntegrationConstruct} from "./application-integration/application-integration-construct";
import {ComputeConstruct} from "./compute/compute-construct";
import {OrchestrationConstruct} from "./orchestration/orchestration-construct";
import * as cdk from 'aws-cdk-lib';

export interface WikiIPFSBackendProps extends StackProps {
  readonly environment: string
}

export class WikiIPFSBackendStack extends Stack {
  constructor(scope: Construct, id: string,  props: WikiIPFSBackendProps) {
    super(scope, id, props);

    const applicationIntegrationSubStack = new ApplicationIntegrationConstruct(
      this,
      `ApplicationIntegration-${props.environment}`,
    {
        environment: props.environment
      }
    );

    const computeSubStack = new ComputeConstruct(
        this,
        `ComputeConstruct-${props.environment}`,
        {
          environment: props.environment,
          eventBus: applicationIntegrationSubStack.eventBus
        }
    );
    applicationIntegrationSubStack.eventBus.grantPutEventsTo(computeSubStack.publishEventToEventBusFunction);

    new events.Rule(
        this,
        'EventRuleStartGenerateHashStateMachine',
        {
          eventBus: applicationIntegrationSubStack.eventBus,
          enabled: true,
          description: "The event rule responsible of filtering Chainlink Oracle published in the Event Bus and " +
              "start the correct AWS Lambda Function",
          eventPattern: {
            detail: {
              eventName: 'CHAINLINK_REQUEST'
            }
          },
          targets: [
            new events_targets.LambdaFunction(computeSubStack.startGenerateHashStateMachineFunction)
          ]
        }
    );

    const orchestrationSubStack = new OrchestrationConstruct(
        this,
        `OrchestrationConstruct-${props.environment}`,
        {
          environment: props.environment
        }
    );
    computeSubStack.startGenerateHashStateMachineFunction.addEnvironment(
        'GENERATE_HASH_STATE_MACHINE_ARN', orchestrationSubStack.generateHashStateMachine.stateMachineArn);


  }
}
