import {
  aws_events as events,
  aws_iam as iam,
  aws_lambda_nodejs as lambda_nodejs,
  aws_stepfunctions as stepfunctions,
  aws_stepfunctions_tasks as stepfunctions_tasks, Stack
} from 'aws-cdk-lib';
import {Construct} from "constructs";
import {ConstructProps} from "../utils/construct-props";

export interface OrchestrationProps extends ConstructProps {
  readonly generateFileHashFunction: lambda_nodejs.NodejsFunction,
  readonly generateMerkleRootFunction: lambda_nodejs.NodejsFunction,
  readonly getAllCIDsFunction: lambda_nodejs.NodejsFunction,
  readonly publishResultToChainlinkFunction: lambda_nodejs.NodejsFunction
}

export class OrchestrationConstruct extends Construct {
  public readonly generateHashStateMachine: stepfunctions.StateMachine;
  private generateHashStateMachineIamRole: iam.Role;
  constructor(scope: Construct, id: string, props: OrchestrationProps) {
    super(scope, id);

    // get CIDs (recursive)

    /**
     * {
     *   "masterCID": "string",
     *   "masterCIDtype": "folder | file",
     *   "numFiles": "single | multiple",
     *   "schema": [
     *     {
     *       "CIDType": "folder | file",
     *       "CID: "string"
     *     }
     *   ],
     *   "filesCIDs": ["string", "string", "string"]
     * }
     */

    // generate hashes for each CID -> // iterate each filesCIDs
    /**
     * aggiunge "fileHashes" a tutto quello di prima
     */

    // generate merkle root
    /**
     * è singolo e masterCIDtype è folder --> 2 hash con differenti CID
     * altrimenti 1
     *
     * se è multiple e masterCIDtype folder, genero merkle root: da lista di hash torna un hash (libreria node)
     */

    // publish CIDs on Chain
    /**
     *
     */

    this.generateHashStateMachineIamRole = new iam.Role(
        this,
        "GenerateHashStateMachineIamRole",
        {
          assumedBy: new iam.ServicePrincipal(`states.${Stack.of(this).region}.amazonaws.com`),
          description: 'IAM Role used by the State Machine to generate CID hashes',
          path: '/',
          managedPolicies: [
            iam.ManagedPolicy.fromManagedPolicyArn(
                this,
                'WikiIPFSGenerateHashesStateMachineCloudWatchEventsFullAccess',
                'arn:aws:iam::aws:policy/CloudWatchEventsFullAccess'
            )
          ],
          roleName: `${props.environment}.wiki-ipfs-generate-hash-state-machine.iam-role`
        }
    );
    this.generateHashStateMachineIamRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['lambda:InvokeFunction'],
      resources: [
        props.getAllCIDsFunction.functionArn,
        props.generateFileHashFunction.functionArn,
        props.generateMerkleRootFunction.functionArn,
        props.publishResultToChainlinkFunction.functionArn
      ]
    }));

    const publishResultToChainlinkTask = new stepfunctions_tasks.LambdaInvoke(
        this,
        'PublishResultToChainlink',
        {
          lambdaFunction: props.publishResultToChainlinkFunction,
          invocationType: stepfunctions_tasks.LambdaInvocationType.REQUEST_RESPONSE,
          comment: 'Publish result generated to Chainlink Oracle',
          payload: stepfunctions.TaskInput.fromObject({
            'requestURL.$': '$.requestURL',
            'jobRunID.$': '$.jobRunID',
            'CIDList.$': '$.merkleRoot.CIDList',
            'hashList.$': '$.merkleRoot.hashList'
          }),
          resultSelector: {
            'success.$': '$.Payload.success',
            'errorMessage.$': '$.Payload.errorMessage'
          },
          resultPath: '$.publishResultToChainlinkResult'
        }
    );
    const stateMachineSucceeded = new stepfunctions.Succeed(
        this,
        "Succeed",
        {
          comment: "The StepFunction Succeeded"
        }
    );

    const stateMachineDefinition = new stepfunctions_tasks.LambdaInvoke(
        this,
        'GetAllCIDsRecursively',
        {
          lambdaFunction: props.getAllCIDsFunction,
          invocationType: stepfunctions_tasks.LambdaInvocationType.REQUEST_RESPONSE,
          comment: 'Given 1 CID, get all the CIDs recursively',
          payload: stepfunctions.TaskInput.fromObject({
            "CIDList.$": "$.CIDList"
          }),
          resultSelector: {
            "masterCID.$": "$.Payload.masterCID",
            "masterCIDType.$": "$.Payload.masterCIDType",
            "numFiles.$": "$.Payload.numFiles",
            "schema.$": "$.Payload.schema",
            "filesCIDs.$": "$.Payload.filesCIDs"
          },
          resultPath: "$.getAllCIDs"
        }
    ).next(
        new stepfunctions.Map(
            this,
            'IterateEachCIDFile',
            {
              comment: 'Iterate each CID file and generate its hash',
              maxConcurrency: 20,
              inputPath: '$.getAllCIDs.filesCIDs',
              resultPath: "$.fileHashes"
            }
        ).iterator(
            new stepfunctions_tasks.LambdaInvoke(
                this,
                'GenerateCIDFileHash',
                {
                  lambdaFunction: props.generateFileHashFunction,
                  invocationType: stepfunctions_tasks.LambdaInvocationType.REQUEST_RESPONSE,
                  comment: 'Given 1 CID file, generate the file hash',
                  payload: stepfunctions.TaskInput.fromObject({
                    "CID.$": "$"
                  }),
                  resultSelector: {
                    "CID.$": "$.Payload.CID",
                    "hash.$": "$.Payload.hash"
                  }
                }
            )
        )
    ).next(
        new stepfunctions_tasks.LambdaInvoke(
            this,
            'GenerateMerkleRoot',
            {
              lambdaFunction: props.generateMerkleRootFunction,
              invocationType: stepfunctions_tasks.LambdaInvocationType.REQUEST_RESPONSE,
              comment: 'Generate Merkle Root if necessary',
              payload: stepfunctions.TaskInput.fromObject({
                "masterCIDType.$": "$.getAllCIDs.masterCIDType",
                "masterCID.$": "$.getAllCIDs.masterCID",
                "numFiles.$": "$.getAllCIDs.numFiles",
                "fileHashes.$": "$.fileHashes"
              }),
              resultSelector: {
                "CIDList.$": "$.Payload.CIDList",
                "hashList.$": "$.Payload.hashList"
              },
              resultPath: "$.merkleRoot"
            }
        )
    ).next(
        new stepfunctions.Choice(this,
            'DoIHaveToPublishResultToChainlink',
            {
              comment: 'Check if I have to publish result to Chainlink Oracle'
            }
        ).when(stepfunctions.Condition.and(
            stepfunctions.Condition.isPresent('$.publishResultToChainlink'),
            stepfunctions.Condition.booleanEquals('$.publishResultToChainlink', true)),
            publishResultToChainlinkTask)
            .afterwards({includeOtherwise: true, includeErrorHandlers: true})
    ).next(stateMachineSucceeded)
    this.generateHashStateMachine = new stepfunctions.StateMachine(
        this,
        "GenerateHashStateMachine",
        {
          stateMachineName: `${props.environment}.wiki-ipfs-generate-hash.state-machine`,
          definition: stateMachineDefinition,
          stateMachineType: stepfunctions.StateMachineType.STANDARD
        }
    );
  }
}
