import React from 'react';
import {Box, Chip, Typography, useMediaQuery} from "@mui/material";
import {Biotech} from "@mui/icons-material";
import {theme} from "../../../GlobalStyles";
import {useNetwork} from "wagmi";

/**
 *
 * @param {React.PropsWithChildren<ICommonHeader>} props
 * @return {JSX.Element}
 * @constructor
 */
const CommonHeader: React.FC<ICommonHeader> = (props) => {

  const { chain } = useNetwork();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const goToUrl = (_url: string) => {
    window.open(_url, "_blank");
  }

  return (
    <React.Fragment>
      <Box width={"100%"} height={90} display={"flex"} flexDirection={"row"}
           alignItems={"center"} justifyContent={"center"}>
        TBD - header
      </Box>
    </React.Fragment>
  );
};

export interface ICommonHeader {

}

export default CommonHeader;
