import {
  Stack,
  StackProps,
  Duration,
  aws_events as events,
  aws_iam as iam,
  aws_lambda as lambda,
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
            source: ['com.wikiipfs.oracle'],
            detail: {
              eventName: ['CHAINLINK_REQUEST']
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
          environment: props.environment,
          getAllCIDsFunction: computeSubStack.getAllCIDsFunction,
          generateFileHashFunction: computeSubStack.generateFileHashFunction
        }
    );
    computeSubStack.startGenerateHashStateMachineFunction.addEnvironment(
        'GENERATE_HASH_STATE_MACHINE_ARN', orchestrationSubStack.generateHashStateMachine.stateMachineArn);
    computeSubStack.startGenerateHashStateMachineFunctionIamRole.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['states:StartExecution'],
          resources: [
              orchestrationSubStack.generateHashStateMachine.stateMachineArn
          ]
        })
    );

    new cdk.CfnOutput(
        this,
        'CLExternalAdapterURL',
        {
          value: computeSubStack.publishEventToEventBusFunctionUrl.url,
          description: 'The public URL the Chainlink Node will use to generate hashes',
          exportName: 'clExternalAdapterURL',
        });
  }
}
