import React from 'react';
import {Web3Button} from "@web3modal/react";

/**
 *
 * @param {React.PropsWithChildren<IConnectWalletButton>} props
 * @return {JSX.Element}
 * @constructor
 */
const ConnectWalletButton: React.FC<IConnectWalletButton> = (props) => {
  return (
    <Web3Button/>
  );
};

export interface IConnectWalletButton {

}

export default ConnectWalletButton;
