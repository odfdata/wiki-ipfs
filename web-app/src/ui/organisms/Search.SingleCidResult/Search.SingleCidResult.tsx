import React from 'react';
import {Paper} from "@mui/material";
import {FoundCid} from "../../pages/Search/Search";

/**
 *
 * @param {React.PropsWithChildren<ISearchSingleCidResult>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchSingleCidResult: React.FC<ISearchSingleCidResult> = (props) => {
  return (
    <Paper sx={{px: 2, py: 2}}>
      qui dentro c'è dato di CID
    </Paper>
  );
};

export interface ISearchSingleCidResult {
  cid: FoundCid
}

export default SearchSingleCidResult;
