import React from 'react';
import {Button} from "@mui/material";
import Web3ModalWrapper from "../Web3ModalWrapper/Web3ModalWrapper";

/**
 *
 * @param {React.PropsWithChildren<IConnectWalletButton>} props
 * @return {JSX.Element}
 * @constructor
 */
const ConnectWalletButton: React.FC<IConnectWalletButton> = (props) => {
  return (
    <Web3ModalWrapper>
      <Button variant="outlined"
              sx={{textTransform: "none", width: 150, ml: 6}}>
        Connect Wallet
      </Button>
    </Web3ModalWrapper>
  );
};

export interface IConnectWalletButton {

}

export default ConnectWalletButton;
