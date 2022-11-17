import React from 'react';
import {Box, LinearProgress, Typography} from "@mui/material";

/**
 * Once included, pass the file and the upload automatically starts
 * @param {React.PropsWithChildren<IFileUploadWithProgressBar>} props
 * @return {JSX.Element}
 * @constructor
 */
const FileUploadWithProgressBar: React.FC<IFileUploadWithProgressBar> = (props) => {

  // TODO insert the useUpload to web3.storage

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"left"} flexDirection={"row"}>
      <Box flexGrow={100}>
        <LinearProgress variant="determinate" value={30} />
      </Box>
      <Typography variant="body1" ml={2}>20%</Typography>
    </Box>
  );
};

/**
 * @param {File} file - file to upload
 * @param {function} onComplete - triggered once the complete is over
 */
export interface IFileUploadWithProgressBar {
  file: File,
  onComplete: () => void
}

export default FileUploadWithProgressBar;
