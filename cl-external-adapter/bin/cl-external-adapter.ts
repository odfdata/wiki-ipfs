#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WikiIPFSBackendStack } from '../lib/wiki-ipfs-backend-stack';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

const app = new cdk.App();

const wikiIPFSBackendDevelopment = new WikiIPFSBackendStack(
    app, 'DevWikiIPFSClExternalAdapterStack',
    {
      env: { region: "eu-west-1" },
      environment: 'dev',
      ipfsIPAddress: process.env.IPFS_IP_ADDRESS as string,
      ipfsAuthorizationToken: process.env.IPFS_AUTHORIZATION_TOKEN as string,
      ipfsApiPort: parseInt(process.env.IPFS_API_PORT as string),
      ipfsApiDownloadFilePort: parseInt(process.env.IPFS_API_DOWNLOAD_FILE_PORT as string),
      ipfsProtocol: process.env.IPFS_PROTOCOL as string
    }
);
cdk.Tags.of(wikiIPFSBackendDevelopment).add('project', 'wikiipfs');
cdk.Tags.of(wikiIPFSBackendDevelopment).add('environment', 'dev');
