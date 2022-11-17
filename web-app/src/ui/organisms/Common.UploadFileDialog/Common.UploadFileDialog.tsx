import {Box, Dialog, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React, {useState} from 'react';
import FilePicker from "./FilePicker";
import SingleFileSelected from "./SingleFileSelected";

/**
 *
 * @param {React.PropsWithChildren<ICommonUploadFileDialog>} props
 * @return {JSX.Element}
 * @constructor
 */
const CommonUploadFileDialog: React.FC<ICommonUploadFileDialog> = (props) => {
  const [fileSelected, setFileSelected] = useState<File | undefined>(undefined);

  const onFileDeleted = () => {
    setFileSelected(undefined);
  }

  return (
    <Dialog onClose={props.close} open={props.visible}>
      <DialogTitle>Upload file to IPFS</DialogTitle>
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
              <SingleFileSelected file={fileSelected} onFileDeleted={onFileDeleted}/>
          }
        </Box>


        {/*  TODO place the upload here */}

      </DialogContent>
    </Dialog>
  );
};

export interface ICommonUploadFileDialog {
  visible: boolean,
  close: () => void
}

export default CommonUploadFileDialog;
