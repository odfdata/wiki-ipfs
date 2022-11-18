import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useSearchCID} from "../../../hooks/api/useSearchCID";
import prettyBytes from "pretty-bytes";

/**
 *
 * @param {React.PropsWithChildren<ISearchFileExtraInfo>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchFileExtraInfo: React.FC<ISearchFileExtraInfo> = (props) => {

  const searchCid = useSearchCID(props.cid.cid);

  return (
    <div>
      {
        searchCid.loading || !searchCid.completed ?
          <CircularProgress/>
          :
          <React.Fragment>
            <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}>
              <strong>File Name</strong>: {searchCid.result.isFile ? "-" : searchCid.result.directoryFileList[0].name}
            </Typography>
            <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}>
              <strong>File Size</strong>: {searchCid.result.isFile ? "-" : prettyBytes(searchCid.result.directoryFileList[0].size)}
            </Typography>
          </React.Fragment>
      }
    </div>
  );
};

export interface ISearchFileExtraInfo {
  cid: FoundCid
}

export default SearchFileExtraInfo;
