import {Box, Button, Typography, useMediaQuery} from '@mui/material';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {theme} from "../../../GlobalStyles";
import CommonUploadFileDialog from "../../organisms/Common.UploadFileDialog/Common.UploadFileDialog";
import SearchBar from "../../atoms/SearchBar/SearchBar";
import {Simulate} from "react-dom/test-utils";

/**
 *
 * @param {React.PropsWithChildren<IHome>} props
 * @return {JSX.Element}
 * @constructor
 */
const Home: React.FC<IHome> = (props) => {

  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleUploadFile = () => {
    setShowUploadFile(!showUploadFile);
  }

  /**
   * When enter is pressed while searching, the value is taken and the search is performed
   */
  const enterPressedWhileSearching = (searchValue: string) => {
    if (searchValue.trim() !== "")
      navigate("/search?cid=" + searchValue);
  }

  return (
    <Box width={"100%"} minHeight={"100vh"}
         display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} mt={"20vh"}>
        <img src={"/img/logo.png"} width={180}/>
        <Typography variant="body1" sx={{mt: 2}}>
          Search if a file is already on IPFS, or upload a new one and index it!
        </Typography>

        <Box mt={4}>
          <SearchBar initialValue={""} onEnterPressed={enterPressedWhileSearching} onValueChange={(value: string) => setSearchValue(value)}/>
        </Box>

        <Box mt={3}>
          <Button variant="outlined"
                  onClick={() => {enterPressedWhileSearching(searchValue)}}
                  sx={{textTransform: "none", mr: 1, width: 130}}>
            Search
          </Button>
          <Button variant="outlined"
                  onClick={toggleUploadFile}
                  sx={{textTransform: "none", ml: 1, width: 130}}>
            Upload to IPFS
          </Button>
        </Box>

        {/* Show modal to upload file dialog*/}
        <CommonUploadFileDialog
          visible={showUploadFile}
          close={toggleUploadFile}
        />

      </Box>

    </Box>
  );
};

export interface IHome {

}

export default Home;
