import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./store";
import {CssBaseline, StyledEngineProvider, ThemeProvider} from "@mui/material";
import {theme} from "./GlobalStyles";
import {configureChains, createClient, WagmiConfig} from "wagmi";
import {polygonMumbai} from "wagmi/chains";
import {hyperspace} from "./utils/fevmChainConfiguration";
import {EthereumClient, modalConnectors, walletConnectProvider} from "@web3modal/ethereum";
import {Web3Modal} from "@web3modal/react";


// const { provider, chains } = configureChains(
//   // [polygonMumbai, hyperspace],
//   [polygonMumbai],
//   [
//     publicProvider()
//   ],
// );
// const client = createClient({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector({
//       chains: chains
//     }),
//   ],
//   provider
// });

// Wagmi client
const chains = [hyperspace, polygonMumbai];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "7049a60c93506cd436cffb2551462593" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: "7049a60c93506cd436cffb2551462593",
    version: "2", // or "2"
    appName: "web3Modal",
    chains
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </WagmiConfig>
    </Provider>

    <Web3Modal
      projectId={"7049a60c93506cd436cffb2551462593"}
      ethereumClient={ethereumClient}
      themeColor={"default"}
      themeZIndex={99999}
      enableNetworkView={true}
    />
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
