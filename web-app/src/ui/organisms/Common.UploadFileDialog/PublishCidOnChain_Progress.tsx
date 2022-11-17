import React from 'react';
import {Box, CircularProgress} from "@mui/material";

/**
 *
 * @param {React.PropsWithChildren<IPublishCidOnChainProgress>} props
 * @return {JSX.Element}
 * @constructor
 */
const PublishCidOnChainProgress: React.FC<IPublishCidOnChainProgress> = (props) => {

  

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <CircularProgress size={24}/>
    </Box>
  );
};

export interface IPublishCidOnChainProgress {
  cid: string
}

export default PublishCidOnChainProgress;
