import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {CircularProgress, Typography} from "@mui/material";
import {useSearchCID} from "../../../hooks/api/useSearchCID";
import prettyBytes from "pretty-bytes";
import {useGetOwnerOfCID} from "../../../hooks/contracts/CIDMatcher/useGetOwnerOfCID";
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
  const getOwnerOfCid = useGetOwnerOfCID({
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
              <strong>CID Verifier</strong>: <a href={`https://mumbai.polygonscan.com/address/${getOwnerOfCid.result}`} target={"_blank"}>{getOwnerOfCid.result}</a>
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
