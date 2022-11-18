import React, {useMemo} from 'react';
import {Box, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {FoundCid} from "../../pages/Search/Search";
import {Delete, Download, FindInPage, Search} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {RouteKey} from "../../../App.Routes";
import SearchFileExtraInfo from "./SearchFileExtraInfo";

/**
 *
 * @param {React.PropsWithChildren<ISearchSingleCidResult>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchSingleCidResult: React.FC<ISearchSingleCidResult> = (props) => {

  //TODO get the extra data from a custom hook

  const navigate = useNavigate();

  const inspectCID = () => {
    window.open(`https://cid.ipfs.tech/#${props.cid.cid}`);
  }

  const downloadFile = () => {
    window.open(`https://${props.cid.cid}.ipfs.w3s.link`);
  }

  const searchForHash = () => {
    navigate(RouteKey.Search + "?cid=" + props.cid.hash);
  }

  const verificationStatusAsString = useMemo(() => {
    if (props.cid.status === 0) return "Verification not submitted";
    else if (props.cid.status === 1) return "Verification Pending";
    else if (props.cid.status === 2) return "Certified!";
    else return "Error during certification";
  }, [props.cid.status]);

  return (
    <Paper sx={{px: 2, py: 2}}>
      <Typography variant="h4">{props.cid.cid}</Typography>
      <Typography variant="body1" color={"text-secondary"} sx={{mt: 1}}><strong>Status</strong>: {verificationStatusAsString}</Typography>
      {
        props.cid.status === 2 ?
          <Box mt={0.5} display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography variant="body1" color={"text-secondary"}>
              <strong>SHA-256</strong>: {props.cid.hash}
            </Typography>
            <Tooltip title={"Search for this hash"} onClick={downloadFile} sx={{ml: 0.5}}>
              <IconButton size="small" onClick={searchForHash}>
                <FindInPage fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
          :
          ""
      }

      <SearchFileExtraInfo cid={props.cid}/>

      <Box mt={1} width="100%" display="flex" flexDirection={"row"} alignItems={"right"} justifyContent={"right"}>
        <Tooltip title={"Inspect CID"}>
          <IconButton size="medium" onClick={inspectCID}>
              <Search fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Download file"} onClick={downloadFile}>
          <IconButton size="medium">
            <Download fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export interface ISearchSingleCidResult {
  cid: FoundCid
}

export default SearchSingleCidResult;
