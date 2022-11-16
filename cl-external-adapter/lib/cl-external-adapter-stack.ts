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

export class ClExternalAdapterStack extends Stack {
  constructor(scope: Construct, id: string,  web3storageToken: string, props?: StackProps) {
    super(scope, id, props);
    // create the aws lambda function to generate hash starting from a IPFS CID
    console.log(web3storageToken);
    const fileToHashFunction = new lambda_nodejs.NodejsFunction(
        this, "FileToHashFunction", {
          functionName: "cl-external-adapter-file-to-hash-function",
          runtime: aws_lambda.Runtime.NODEJS_16_X,
          architecture: aws_lambda.Architecture.ARM_64,
          memorySize: 1024,
          timeout: Duration.seconds(500),
          bundling: {
            minify: true
          },
          environment: {
            WEB3_STORAGE: web3storageToken
          },
          logRetention: logs.RetentionDays.TWO_WEEKS,
          depsLockFilePath: path.join(__dirname, 'src/package-lock.json'),
          entry: path.join(__dirname, 'src/fileToHash.ts'),
          handler: "lambdaHandler",
        }
    );
    // expose the aws lambda function in order to be called as Chainlink
    fileToHashFunction.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
      cors: { allowedOrigins: ["*"] }
    });
  }
}
