import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {CircularProgress, Typography} from "@mui/material";
import {useSearchCID} from "../../../hooks/api/useSearchCID";
import prettyBytes from "pretty-bytes";
import {useGetNumberOfEndorser} from "../../../hooks/contracts/EndorseCIDRegistry/useGetNumberOfEndorser";
import {useNetwork} from "wagmi";

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
              <strong>File Name</strong>: {searchCid.result.isFile ? "-" : searchCid.result.directoryFileList[0].name}
            </Typography>
            <Typography variant="body1" color={"text-secondary"} sx={{mt: 0.5}}>
              <strong>Number of Endorser</strong>: {numberOfEndorser.result}
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
