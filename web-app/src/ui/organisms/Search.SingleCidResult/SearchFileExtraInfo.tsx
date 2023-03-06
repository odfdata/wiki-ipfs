import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useSearchCID} from "../../../hooks/api/useSearchCID";
import {useGetNumberOfEndorser} from "../../../hooks/contracts/EndorseCIDRegistry/useGetNumberOfEndorser";
import {useNetwork} from "wagmi";
import {theme} from "../../../GlobalStyles";
import EndorseButtonOption from "./EndorseButtonOption";

/**
 *
 * @param {React.PropsWithChildren<ISearchFileExtraInfo>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchFileExtraInfo: React.FC<ISearchFileExtraInfo> = (props) => {

  const network = useNetwork();
  const searchCid = useSearchCID(props.cid.cid);
  const numberOfEndorser = useGetNumberOfEndorser({
    CID: props.cid.cid,
    chainId: network.chain.id
  });

  return (
    <div>
      {
        searchCid.loading || !searchCid.completed ?
          <CircularProgress/>
          :
          <React.Fragment>
            <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}>
              <strong>Type</strong>: {searchCid.result.isFile ? "File" : "Folder"}
            </Typography>
            <Box display="flex" alignItems={"center"}>
              <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}>
                <strong>Number of Endorser</strong>: {numberOfEndorser.result}
              </Typography>
              <Box sx={{marginLeft: theme.spacing(2)}}>
                <EndorseButtonOption cid={props.cid} refetchNumberOfEndorser={numberOfEndorser.refetch}/>
              </Box>
            </Box>
          </React.Fragment>
      }
    </div>
  );
};

export interface ISearchFileExtraInfo {
  cid: FoundCid
}

export default SearchFileExtraInfo;
