import React, {ChangeEvent} from 'react';
import {Box, Button} from "@mui/material";
import {Description} from "@mui/icons-material";

/**
 *
 * @param {React.PropsWithChildren<IFilePicker>} props
 * @return {JSX.Element}
 * @constructor
 */
const FilePicker: React.FC<IFilePicker> = (props) => {

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    props.onFileSelected(e.target.files[0]);
  }

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Button variant="outlined"
              component="label"
              startIcon={<Description/>}
              sx={{textTransform: "none", ml: 1, width: 130}}>
        Select file
        <input hidden type="file" onChange={onFileSelected}/>
      </Button>
    </Box>
  );
};

export interface IFilePicker {
  onFileSelected: (f: File) => void
}

export default FilePicker;
