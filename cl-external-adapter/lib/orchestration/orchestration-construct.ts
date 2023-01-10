import {
  aws_events as events,
  aws_stepfunctions as stepfunctions,
  aws_stepfunctions_tasks as stepfunctions_tasks
} from 'aws-cdk-lib';
import {Construct} from "constructs";
import {ConstructProps} from "../utils/construct-props";

export interface OrchestrationProps extends ConstructProps { }

export class OrchestrationConstruct extends Construct {
  public readonly generateHashStateMachine: stepfunctions.StateMachine;
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

    const succeedJob = new stepfunctions.Succeed(
        this,
        "Succeed",
        {
          comment: "The StepFunction Succeeded"
        }
    );

    this.generateHashStateMachine = new stepfunctions.StateMachine(
        this,
        "GenerateHashStateMachine",
        {
          stateMachineName: `${props.environment}.wiki-ipfs-generate-hash.state-machine`,
          definition: succeedJob,
          stateMachineType: stepfunctions.StateMachineType.STANDARD
        }
    );
  }
}
