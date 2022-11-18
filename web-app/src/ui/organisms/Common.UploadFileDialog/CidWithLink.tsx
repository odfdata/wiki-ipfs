import React from 'react';
import {Box, Typography} from "@mui/material";
import {OpenInNew} from "@mui/icons-material";

/**
 *
 * @param {React.PropsWithChildren<ICidWithLink>} props
 * @return {JSX.Element}
 * @constructor
 */
const CidWithLink: React.FC<ICidWithLink> = (props) => {
  return (
    <Box display={"flex"} alignItems={"center"}
         justifyContent={"left"} flexDirection={"row"}
         sx={{cursor: "pointer"}}
         onClick={() => window.open(`https://${props.cid}.ipfs.w3s.link`)}
    >
      <Typography variant="body2" color="text-secondary"><strong>CID</strong>: {props.cid}</Typography>
      <OpenInNew sx={{fontSize: 14, ml: 1}}/>
    </Box>
  );
};

export interface ICidWithLink {
  cid: string
}

export default CidWithLink;
