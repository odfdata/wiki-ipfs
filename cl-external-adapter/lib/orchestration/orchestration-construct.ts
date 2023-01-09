import {
  aws_stepfunctions as stepfunctions,
  aws_stepfunctions_tasks as stepfunctions_tasks
} from 'aws-cdk-lib';
import {Construct} from "constructs";

export class OrchestrationConstruct extends Construct {
  private generateHashStepFunction: stepfunctions.StateMachine;
  constructor(scope: Construct, id: string) {
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
          stateMachineName: 'wiki-ipfs-generate-hash.state-machine',
          definition: succeedJob,
          stateMachineType: stepfunctions.StateMachineType.STANDARD
        }
    );
  }
}
