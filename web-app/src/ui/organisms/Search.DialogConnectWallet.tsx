import React from 'react';
import {Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import FilePicker from "./Common.UploadFileDialog/FilePicker";
import SingleFileSelected from "./Common.UploadFileDialog/SingleFileSelected";
import CidWithLink from "./Common.UploadFileDialog/CidWithLink";
import CommmonPublishCidOnChain from "./Common.PublishCidOnChain/CommmonPublishCidOnChain";
import ConnectWalletButton from "../atoms/ConnectWalletButton/ConnectWalletButton";

/**
 *
 * @param {React.PropsWithChildren<ISearchDialogConnectWallet>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchDialogConnectWallet: React.FC<ISearchDialogConnectWallet> = (props) => {
  return (
    <Dialog open={props.visible}>
      <DialogTitle variant={"h3"}>Connect Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To improve user experience and perform required on-chain queries, we need you to connect the wallet.
        </DialogContentText>
        <Box mt={2} mb={2} width="100%" display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <ConnectWalletButton/>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export interface ISearchDialogConnectWallet {
  visible: boolean
}

export default SearchDialogConnectWallet;
