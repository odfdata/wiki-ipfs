import React, {useState} from 'react';
import {Box, Button, IconButton, Typography} from "@mui/material";
import {Close, FileUpload} from "@mui/icons-material";
import FileUploadWithProgressBar from "./FileUploadWithProgressBar";
import prettyBytes from "pretty-bytes";

/**
 * Shows a selected file
 * @param {React.PropsWithChildren<ISingleFileSelected>} props
 * @return {JSX.Element}
 * @constructor
 */
const SingleFileSelected: React.FC<ISingleFileSelected> = (props) => {

  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  const onCompleteUpload = () => {
    alert("Upload completed!");
  }

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}
           flexDirection="row"
      >
        <IconButton color="primary"
                    onClick={props.onFileDeleted}
                    disabled={uploadInProgress}>
          <Close />
        </IconButton>
        <Box ml={2} mr={2} flexGrow={100}>
          <Typography variant="body1">{props.file.name}</Typography>
          <Typography variant="body2" color={"textSecondary"}>{prettyBytes(props.file.size)}</Typography>
        </Box>
        <Button variant="outlined"
                startIcon={<FileUpload/>}
                disabled={uploadInProgress}
                onClick={() => setUploadInProgress(true)}
                sx={{textTransform: "none"}}>
          Upload
        </Button>
      </Box>

      {/* Row to show upload */}
      {
        uploadInProgress ?
          <Box mt={1}>
            <FileUploadWithProgressBar file={props.file} onComplete={onCompleteUpload}/>
          </Box>
          :
          ""
      }

    </Box>

  );
};

/**
 * @param {File} file - file selected
 * @param {function} onFileDeleted - triggered when the user decide to remove the file
 */
export interface ISingleFileSelected {
  file: File,
  onFileDeleted: () => void
}

export default SingleFileSelected;
