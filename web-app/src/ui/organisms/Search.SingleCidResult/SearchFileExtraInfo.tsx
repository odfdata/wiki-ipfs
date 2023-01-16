import React from 'react';
import {FoundCid} from "../../pages/Search/Search";
import {Button, CircularProgress, Typography} from "@mui/material";
import {useSearchCID} from "../../../hooks/api/useSearchCID";
import prettyBytes from "pretty-bytes";
import {useGetNumberOfEndorser} from "../../../hooks/contracts/EndorseCIDRegistry/useGetNumberOfEndorser";
import {useNetwork} from "wagmi";
import {useEndorseCIDList} from "../../../hooks/contracts/EndorseCIDRegistry/useEndorseCIDList";

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
  const endorseCidList = useEndorseCIDList({CIDList: [props.cid.cid]});

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
            <Button variant={"outlined"} size={"small"} sx={{fontSize: 4}} onClick={() => endorseCidList?.write()}>
              Endorse
            </Button>
          </React.Fragment>
      }
    </div>
  );
};

export interface ISearchFileExtraInfo {
  cid: FoundCid
}

export default SearchFileExtraInfo;
