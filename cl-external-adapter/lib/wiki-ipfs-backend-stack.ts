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

export class WikiIPFSBackendStack extends Stack {
  constructor(scope: Construct, id: string,  web3storageToken: string, props?: StackProps) {
    super(scope, id, props);

  }
}
