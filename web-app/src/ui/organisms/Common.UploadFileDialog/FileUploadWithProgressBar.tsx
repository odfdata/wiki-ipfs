import React, {useEffect} from 'react';
import {Box, LinearProgress, Typography} from "@mui/material";
import {useUploadFile} from "../../../hooks/web3Storage/useUploadFile";

/**
 * Once included, pass the file and the upload automatically starts
 * @param {React.PropsWithChildren<IFileUploadWithProgressBar>} props
 * @return {JSX.Element}
 * @constructor
 */
const FileUploadWithProgressBar: React.FC<IFileUploadWithProgressBar> = (props) => {

  const uploadFile = useUploadFile({file: props.file});

  useEffect(() => {
    if (uploadFile.completed)
      props.onComplete(uploadFile.result.cid)
  }, [uploadFile.completed])

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"left"} flexDirection={"row"}>
      <Box flexGrow={100}>
        <LinearProgress variant="determinate" value={uploadFile.progress} />
      </Box>
      <Typography variant="body1" ml={2}>{uploadFile.progress.toFixed(2)}%</Typography>
    </Box>
  );
};

/**
 * @param {File} file - file to upload
 * @param {function} onComplete - triggered once the complete is over, passing the file CID
 */
export interface IFileUploadWithProgressBar {
  file: File,
  onComplete: (cid: string) => void
}

export default FileUploadWithProgressBar;
