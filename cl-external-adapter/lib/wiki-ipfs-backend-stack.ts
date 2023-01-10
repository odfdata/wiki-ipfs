import {
  Stack,
  StackProps,
  Duration,
  aws_lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";
import {ApplicationIntegrationConstruct} from "./application-integration/application-integration-construct";
import {ComputeConstruct} from "./compute/compute-construct";
import {OrchestrationConstruct} from "./orchestration/orchestration-construct";

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
          environment: props.environment
        }
    );
    const orchestrationSubStack = new OrchestrationConstruct(
        this,
        `OrchestrationConstruct-${props.environment}`,
        {
          environment: props.environment
        }
    );
  }
}
