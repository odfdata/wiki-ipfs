# Bacalhau

This example was used during the Chainlink Fall 2022 Hackaton to make docker images for bacalhau
to verify the ownership of the files during Bacahlau computation.

The current state of the image has been pushed to a docker repo called `wikiipfs/testbacalhau`. 
It's just an example to show how to check files ownership.

## Development

We have developed the `Dockerfile` and the `index.ts` file. To build and publish the update image on dockerhub,
run the following commands:

+ `docker build . -t wikiipfs/testbacalhau:latest --build-arg MUMBAI_PROVIDER={your_mumbai_provider}`
+ `docker push wikiipfs/testbacalhau:latest`

# Usage

+ Save a file on IPFS using our platform
+ Index the uploaded file on-chain (it will be stored the ownership)
+ Save the CID of the uploaded file
+ Send a request to the bacalhau network to run the container
`bacalhau docker run wikiipfs/testbacalhau:latest --inputs CIDs`
+ Get the outputs from IPFS `bacalhau get JOB_ID`
