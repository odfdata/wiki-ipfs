import {Construct} from "constructs";
import {
  aws_events as events,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  Duration
} from "aws-cdk-lib";
import * as path from "path";
import {ConstructProps} from "../utils/construct-props";
import {OutputFormat} from "aws-cdk-lib/aws-lambda-nodejs";

export interface ComputeProps extends ConstructProps {
  readonly eventBus: events.EventBus,
  readonly ipfsIPAddress: string
}

export class ComputeConstruct extends Construct {
  public readonly getAllCIDsFunction: lambda_nodejs.NodejsFunction;
  public readonly publishEventToEventBusFunction: lambda_nodejs.NodejsFunction;
  public readonly startGenerateHashStateMachineFunctionIamRole: iam.Role;
  public readonly startGenerateHashStateMachineFunction: lambda_nodejs.NodejsFunction;
  public readonly publishEventToEventBusFunctionUrl: lambda.FunctionUrl;
  public readonly generateFileHashFunction: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: ComputeProps) {
    super(scope, id);

    this.publishEventToEventBusFunction = new lambda_nodejs.NodejsFunction(
      this,
      'PublishEventToEventBusFunction',
        {
          functionName: `${props.environment}-wikiipfs-publish-oracle-request-function`,
          runtime: lambda.Runtime.NODEJS_16_X,
          architecture: lambda.Architecture.ARM_64,
          memorySize: 256,
          timeout: Duration.seconds(30),
          bundling: {
            minify: true
          },
          environment: {
            EVENT_BRIDGE_BUS_ARN: props.eventBus.eventBusArn
          },
          depsLockFilePath: path.join(__dirname, 'src/yarn.lock'),
          logRetention: logs.RetentionDays.TWO_WEEKS,
          entry: path.join(__dirname, 'src/publish-event-to-event-bus.ts'),
          handler: "lambdaHandler"
        }
    );
    // expose the aws lambda function in order to be called as Chainlink
    this.publishEventToEventBusFunctionUrl = this.publishEventToEventBusFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: { allowedOrigins: ["*"] }
    });

    this.startGenerateHashStateMachineFunctionIamRole = new iam.Role(
        this,
        'StartGenerateHashStateMachineFunctionIamRole',
        {
          assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
          description: 'IAM Role used by the AWS Function responsible for starting the AWS State Machine to ' +
              'generate the hashes',
          roleName: `${props.environment}.wikiipfs-start-state-machine-function.iam-role`,
          path: '/',
          managedPolicies: [
              iam.ManagedPolicy.fromManagedPolicyArn(
                  this,
                  "AWSLambdaBasicExecutionRole",
                  "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
              )
          ]
        }
    );

    this.startGenerateHashStateMachineFunction = new lambda_nodejs.NodejsFunction(
        this,
        'StartGenerateHashStateMachineFunction',
        {
          functionName: `${props.environment}-wikiipfs-start-state-machine-function`,
          role: this.startGenerateHashStateMachineFunctionIamRole,
          runtime: lambda.Runtime.NODEJS_16_X,
          architecture: lambda.Architecture.ARM_64,
          memorySize: 256,
          timeout: Duration.seconds(30),
          bundling: {
            minify: true,

          },
          depsLockFilePath: path.join(__dirname, 'src/yarn.lock'),
          logRetention: logs.RetentionDays.TWO_WEEKS,
          entry: path.join(__dirname, 'src/start-generate-hash-state-machine.ts'),
          handler: "lambdaHandler"
        }
    );

    this.getAllCIDsFunction = new lambda_nodejs.NodejsFunction(
        this,
        "GetAllCIDsFunction",
        {
          functionName: `${props.environment}-wikiipfs-get-all-cids-function`,
          runtime: lambda.Runtime.NODEJS_16_X,
          architecture: lambda.Architecture.ARM_64,
          memorySize: 1024,
          timeout: Duration.seconds(900),
          bundling: {
            minify: true,
            nodeModules: ['kubo-rpc-client'],
            target: 'es2020',
            format: OutputFormat.ESM
          },
          environment: {
            IPFS_IP_ADDRESS: props.ipfsIPAddress
          },
          depsLockFilePath: path.join(__dirname, 'src/yarn.lock'),
          logRetention: logs.RetentionDays.TWO_WEEKS,
          entry: path.join(__dirname, 'src/get-all-cids.ts'),
          handler: "lambdaHandler"
        }
    );

    this.generateFileHashFunction = new lambda_nodejs.NodejsFunction(
        this,
        'GenerateFileHashFunction',
        {
          functionName: `${props.environment}-wikiipfs-generate-file-hash-function`,
          runtime: lambda.Runtime.NODEJS_16_X,
          architecture: lambda.Architecture.ARM_64,
          memorySize: 1024,
          timeout: Duration.seconds(900),
          bundling: {
            minify: true,
            nodeModules: ['kubo-rpc-client'],
            target: 'es2020',
            format: OutputFormat.ESM
          },
          depsLockFilePath: path.join(__dirname, 'src/yarn.lock'),
          logRetention: logs.RetentionDays.TWO_WEEKS,
          entry: path.join(__dirname, 'src/generate-file-hash.ts'),
          handler: 'lambdaHandler'
        }
    )
    /*
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
     */
  }
}
