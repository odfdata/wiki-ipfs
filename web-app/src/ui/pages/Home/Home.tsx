import {Box, Button, Grid, Typography, useMediaQuery} from '@mui/material';
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import CommonHeader from "../../organisms/Common.Header/Common.Header";
import {theme} from "../../../GlobalStyles";
import {RouteKey} from "../../../App.Routes";
import Web3ModalWrapper from "../../atoms/Web3ModalWrapper/Web3ModalWrapper";
import {useAccount} from "wagmi";

/**
 *
 * @param {React.PropsWithChildren<IHome>} props
 * @return {JSX.Element}
 * @constructor
 */
const Home: React.FC<IHome> = (props) => {

  const navigate = useNavigate();

  const { address: connectedWalletAddress } = useAccount();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (connectedWalletAddress) {
      navigate(RouteKey.dApp);
    }
  }, [connectedWalletAddress]);

  return (
    <Box width={"100%"} minHeight={"100vh"}
         display={"flex"} flexDirection={"column"}>
      <CommonHeader/>
      TBD

    </Box>
  );
};

export interface IHome {

}

export default Home;
