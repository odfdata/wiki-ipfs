import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {Typography} from "@mui/material";

/**
 *
 * @param {React.PropsWithChildren<ISearchFileExtraInfo>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchFileExtraInfo: React.FC<ISearchFileExtraInfo> = (props) => {

  

  return (
    <div>

      <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}><strong>File Name</strong>: Pippo.xml</Typography>
      <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}><strong>File Size</strong>: 50.1 MB</Typography>
    </div>
  );
};

export interface ISearchFileExtraInfo {
  cid: FoundCid
}

export default SearchFileExtraInfo;
