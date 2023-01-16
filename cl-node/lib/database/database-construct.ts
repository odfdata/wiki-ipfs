import {Construct} from "constructs";
import {
  aws_ec2 as ec2,
  aws_rds as rds} from "aws-cdk-lib";

export interface DatabaseConstructProps {

}

export class DatabaseConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);
    /*
    const dbServer = new rds.DatabaseInstance(
        this,
        'ChainlinkNodeInstance',
        {
          vpcSubnets: {
            onePerAz: true,
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED
          },
          credentials: rds.Credentials.fromSecret(creds),
          vpc: vpc,
          port: 3306,
          databaseName: 'efvm',
          allocatedStorage: 100,
          instanceIdentifier,
          engine: rds.DatabaseInstanceEngine.postgres({
            version: rds.PostgresEngineVersion.VER_13_7
          }),
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM)
        });
        
     */
  }
}
