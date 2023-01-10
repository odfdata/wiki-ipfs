import {
  aws_stepfunctions as stepfunctions,
  aws_stepfunctions_tasks as stepfunctions_tasks
} from 'aws-cdk-lib';
import {Construct} from "constructs";
import {ConstructProps} from "../utils/construct-props";

export interface OrchestrationProps extends ConstructProps { }

export class OrchestrationConstruct extends Construct {
  private generateHashStepFunction: stepfunctions.StateMachine;
  constructor(scope: Construct, id: string, props: OrchestrationProps) {
    super(scope, id);

    const succeedJob = new stepfunctions.Succeed(
        this,
        "Succeed",
        {
          comment: "The StepFunction Succeeded"
        }
    );
    this.generateHashStepFunction = new stepfunctions.StateMachine(
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
