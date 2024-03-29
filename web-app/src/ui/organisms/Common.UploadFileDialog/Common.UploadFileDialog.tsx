import {Box, Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React, {useState} from 'react';
import FilePicker from "./FilePicker";
import SingleFileSelected from "./SingleFileSelected";
import CidWithLink from "./CidWithLink";
import {useAccount} from "wagmi";
import CommmonPublishCidOnChain from "../Common.PublishCidOnChain/CommmonPublishCidOnChain";
import ConnectWalletButton from "../../atoms/ConnectWalletButton/ConnectWalletButton";
import {useNavigate} from "react-router-dom";

/**
 *
 * @param {React.PropsWithChildren<ICommonUploadFileDialog>} props
 * @return {JSX.Element}
 * @constructor
 */
const CommonUploadFileDialog: React.FC<ICommonUploadFileDialog> = (props) => {
  const [fileSelected, setFileSelected] = useState<File | undefined>(undefined);
  const [uploadedCid, setUploadedCid] = useState<string>("");

  const account = useAccount();
  const navigate = useNavigate();

  const onFileDeleted = () => {
    setFileSelected(undefined);
  }

  const onUploadComplete = (cid: string) => {
    setUploadedCid(cid);
  }


  const goToSearch = (): void => {
    navigate(`/search?cid=${uploadedCid}`);
  }

  return (
    <Dialog onClose={props.close} open={props.visible}>
      {
        uploadedCid == "" ?
          <React.Fragment>
            <DialogTitle variant={"h3"}>Upload file to IPFS</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Upload a file to IPFS and register it's hash on Polygon blockchain. This allows to easily index the document and avoid duplicates.
              </DialogContentText>
              {/* Fle picker and upload */}
              <Box mt={2} mb={2}>
                {
                  fileSelected === undefined ?
                    <FilePicker onFileSelected={(f: File) => setFileSelected(f)}/>
                    :
                    <SingleFileSelected file={fileSelected} onFileDeleted={onFileDeleted} onUploadComplete={onUploadComplete}/>
                }
              </Box>
            </DialogContent>
          </React.Fragment>
          :
          <React.Fragment>
            <DialogTitle variant={"h4"}>File uploaded! 👏</DialogTitle>
            <DialogContent>
              <CidWithLink cid={uploadedCid}/>
              <Box display={"flex"} alignItems={"start"} mt={2}>
                <DialogContentText flexGrow={100}>To complete the index process, please connect wallet and publish the CID on chain</DialogContentText>
                <Box width={180} display={"flex"} justifyContent={"right"} ml={6}>
                  {
                    account.isConnected ?
                      <CommmonPublishCidOnChain cid={uploadedCid} onComplete={goToSearch}/>
                      :
                      <ConnectWalletButton/>
                  }
                </Box>
              </Box>
            </DialogContent>
          </React.Fragment>
      }

    </Dialog>
  );
};

export interface ICommonUploadFileDialog {
  visible: boolean,
  close: () => void
}

export default CommonUploadFileDialog;
