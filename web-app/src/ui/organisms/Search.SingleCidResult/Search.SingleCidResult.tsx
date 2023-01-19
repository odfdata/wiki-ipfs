import React, {useEffect, useMemo} from 'react';
import {Box, Button, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import {FoundCid} from "../../pages/Search/Search";
import {Download, FindInPage, Plagiarism, PlagiarismOutlined, Search} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {RouteKey} from "../../../App.Routes";
import SearchFileExtraInfo from "./SearchFileExtraInfo";
import {useRequestCid2Hash} from "../../../hooks/contracts/CID2HashOracleLogic/useRequestCid2Hash";

/**
 *
 * @param {React.PropsWithChildren<ISearchSingleCidResult>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchSingleCidResult: React.FC<ISearchSingleCidResult> = (props) => {

  const navigate = useNavigate();
  const requestCid2Hash = useRequestCid2Hash({
    CIDList: [props.cid.cid]
  });

  useEffect(() => {
    if (requestCid2Hash.completed) {
      // refresh the page to reload CID status
      // TODO better to create a component that listen to events and on those events reloads data from SCs
      window.location.reload();
    }
  }, [requestCid2Hash.completed]);

  const inspectCID = () => {
    window.open(`https://cid.ipfs.tech/#${props.cid.cid}`);
  }

  const viewRawData = () => {
    window.open(`https://explore.ipld.io/#/explore/${props.cid.cid}`);
  }

  const downloadFile = () => {
    window.open(`https://${props.cid.cid}.ipfs.w3s.link`);
  }

  const searchForHash = () => {
    navigate(RouteKey.Search + "?cid=" + props.cid.hash);
  }

  const verificationStatusAsString = useMemo(() => {
    if (props.cid.status === 0) return "Verification NOT submitted";
    else if (props.cid.status === 1) return "Verification Pending";
    else if (props.cid.status === 2) return "Certified!";
    else return "Error during certification";
  }, [props.cid.status]);

  return (
    <Paper sx={{px: 2, py: 2}} elevation={3}>
      <Typography variant="h4">{props.cid.cid}</Typography>
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"} mt={1}>
        <Typography variant="body1" color={"text-secondary"}>
          <strong>Status</strong>: {verificationStatusAsString}
        </Typography>
        {
          props.cid.status === 0 ?
            <Button variant={"outlined"}
                    size={"small"}
                    sx={{fontSize: 10, marginLeft: 2, paddingX: 1}}
                    onClick={() => requestCid2Hash?.write()}>
              Verify It!
            </Button>
            :
            ""
        }
      </Box>

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
        <Tooltip title={"View RAW IPFS data"}>
          <IconButton size="medium" onClick={viewRawData}>
              <PlagiarismOutlined fontSize="inherit" />
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
