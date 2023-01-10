import {Construct} from "constructs";
import {aws_lambda, aws_lambda_nodejs as lambda_nodejs, aws_logs as logs, Duration} from "aws-cdk-lib";
import * as path from "path";
import {ConstructProps} from "../utils/construct-props";

export interface ComputeProps extends ConstructProps { }
export class ComputeConstruct extends Construct {

  constructor(scope: Construct, id: string, props: ComputeProps) {
    super(scope, id);

    // create the aws lambda function to generate hash starting from a IPFS CID
    // console.log(web3storageToken);
    const fileToHashFunction = new lambda_nodejs.NodejsFunction(
        this, "FileToHashFunction", {
          functionName: "cl-external-adapter-file-to-hash-function",
          runtime: aws_lambda.Runtime.NODEJS_16_X,
          architecture: aws_lambda.Architecture.ARM_64,
          memorySize: 1024,
          timeout: Duration.seconds(900),
          bundling: {
            minify: true
          },
          environment: {
            // WEB3STORAGE_TOKEN: web3storageToken
          },
          logRetention: logs.RetentionDays.TWO_WEEKS,
          depsLockFilePath: path.join(__dirname, 'src/yarn.lock'),
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
