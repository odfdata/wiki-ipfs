import React from 'react';
import {Box, Typography} from "@mui/material";
import CommmonPublishCidOnChain from "../Common.PublishCidOnChain/CommmonPublishCidOnChain";
import search from "../../pages/Search/Search";
import {useNavigate} from "react-router-dom";
import {RouteKey} from "../../../App.Routes";

/**
 *
 * @param {React.PropsWithChildren<ISearchNothingToShow>} props
 * @return {JSX.Element}
 * @constructor
 */
const SearchNothingToShow: React.FC<ISearchNothingToShow> = (props) => {

  const navigate = useNavigate();

  const onAddComplete = () => {
    navigate(RouteKey.Search + "?cid=" + props.searchValue);
  }

  return (
    <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
      <img src={"/img/empty.svg"} width={180}/>
      {
        props.isHash ?
          <Typography variant="h4" sx={{mt: 3}}>
            Sorry, as of today no one has indexed an IPFS file with this hash!
          </Typography>
            :
          <Typography variant="h4" sx={{mt: 3}}>
            Sorry, as of today no one has indexed an IPFS file this CID!
          </Typography>
      }
      {
        !props.isHash ?
          <React.Fragment>
            <Typography variant="body1" sx={{mt: 2}}>
              If the CID you provided exists, you can <a href={`https://${props.searchValue}.ipfs.w3s.link`} target={"_blank"}>see the file content here</a>
            </Typography>
            <Typography variant="body1" sx={{mb: 2}}>
              If the file exists, and it's a CID with just one file, please publish it on chain!
            </Typography>
            <CommmonPublishCidOnChain cid={props.searchValue} onComplete={onAddComplete}/>
          </React.Fragment>
          :
          ""
      }
    </Box>
  );
};

export interface ISearchNothingToShow {
  searchValue: string,
  isHash: boolean
}

export default SearchNothingToShow;
