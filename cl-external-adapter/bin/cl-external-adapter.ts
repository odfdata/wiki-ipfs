#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClExternalAdapterStack } from '../lib/cl-external-adapter-stack';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

const app = new cdk.App();
new ClExternalAdapterStack(app, 'ClExternalAdapterStack', process.env.WEB3STORAGE_TOKEN as string, {
  env: { region: "eu-west-1" }
});
