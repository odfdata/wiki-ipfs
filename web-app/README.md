# Wiki IPFS

This repo contains the code for the frontend dApp to access Wiki IPFS and interact both with web3.storage and Mumbai deployed Smart Contract.

This is a project for the CL Fall Hackathon 22

## Project creation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Possible improvements

* Improve the `useSearchCID` hook to understand if a CID represents a file or a folder
* Listen to events to better reload information in memory (like # of endorsers or verification status)
* refactor the UI

