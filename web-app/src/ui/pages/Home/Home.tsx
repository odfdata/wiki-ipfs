import {Box, Button, Divider, IconButton, InputBase, Paper, Tooltip, Typography, useMediaQuery} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CommonHeader from "../../organisms/Common.Header/Common.Header";
import {theme} from "../../../GlobalStyles";
import {RouteKey} from "../../../App.Routes";
import {useAccount} from "wagmi";
import {Description, Search} from "@mui/icons-material";
import CommonUploadFileDialog from "../../organisms/Common.UploadFileDialog/Common.UploadFileDialog";

/**
 *
 * @param {React.PropsWithChildren<IHome>} props
 * @return {JSX.Element}
 * @constructor
 */
const Home: React.FC<IHome> = (props) => {

  const navigate = useNavigate();
  const [showUploadFile, setShowUploadFile] = useState<boolean>(false);

  const { address: connectedWalletAddress } = useAccount();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (connectedWalletAddress) {
      navigate(RouteKey.dApp);
    }
  }, [connectedWalletAddress]);

  const toggleUploadFile = () => {
    setShowUploadFile(!showUploadFile);
  }

  return (
    <Box width={"100%"} minHeight={"100vh"}
         display={"flex"} flexDirection={"column"}>
      <CommonHeader/>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} mt={"20vh"}>
        <div style={{width: 180, height: 80, backgroundColor: "#e8aeae", borderRadius: 8}}></div>
        <Typography variant="body1" sx={{mt: 2}}>
          Search if a file is already on IPFS, or upload a new one and index it!
        </Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', mt: 4, display: 'flex', alignItems: 'center', width: 500 }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="menu">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search by Sha-256 hash or CID"
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} >
            <Tooltip title={"Select file to search"}>
              <Description />
            </Tooltip>
          </IconButton>
        </Paper>

        <Box mt={3}>
          <Button variant="outlined"
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
