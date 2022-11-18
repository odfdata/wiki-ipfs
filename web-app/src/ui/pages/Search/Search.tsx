import React, {useEffect, useMemo, useState} from 'react';
import {Box, CircularProgress, Container, Paper} from "@mui/material";
import SearchBar from "../../atoms/SearchBar/SearchBar";
import {useNetwork, useQuery} from "wagmi";
import {useParams} from "react-router";
import {useNavigate, useSearchParams} from "react-router-dom";
import {RouteKey} from "../../../App.Routes";
import {useGetCIDsFromHash} from "../../../hooks/contracts/CIDMatcher/useGetCIDsFromHash";
import {useDebounce} from "use-debounce";
import {useGetHashFromCID} from "../../../hooks/contracts/CIDMatcher/useGetHashFromCID";
import {useGetVerificationStatus} from "../../../hooks/contracts/CIDMatcher/useGetVerificationStatus";
import {useAppDispatch} from "../../../hooks/redux/reduxHooks";
import SearchSingleCidResult from "../../organisms/Search.SingleCidResult/Search.SingleCidResult";
import SearchNothingToShow from "../../organisms/Search.NothingToShow/Search.NothingToShow";

/**
 * Define the shape of the information to pass to the list of papers for rendering
 * @param {string} cid - the CID
 * @param {number} status - the status - 1 pending - 2 completed - 3+ error in verificatin process
 */
export interface FoundCid {
  cid: string,
  hash: string,
  status: number
}

/**
 *
 * @param {React.PropsWithChildren<ISearch>} props
 * @return {JSX.Element}
 * @constructor
 */
const Search: React.FC<ISearch> = (props) => {

  const [searchParams, setSearchParams]  = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>(searchParams.get("cid"));
  const [cidList, setCidList] = useState<FoundCid[]>([]);
  const [searchValueDebounced] = useDebounce(searchValue, 500);
  const network = useNetwork();
  const navigate = useNavigate();

  const cidQueryString = useMemo(() => searchParams.get("cid"), [searchParams.get("cid")]);
  const isHash = useMemo(() =>
    new RegExp(/^(0x)?[A-Fa-f0-9]{64}$/).test(searchValue), [searchValueDebounced]);

  const hashSanitized = useMemo(() => searchValueDebounced.startsWith("0x") ? searchValueDebounced : "0x" + searchValueDebounced, [searchValueDebounced]);
  const cidFromHash = useGetCIDsFromHash({chainId: network.chain.id, hash: hashSanitized});
  const hashFromCid = useGetHashFromCID({chainId: network.chain.id, CID: searchValueDebounced});
  const verificationStatus = useGetVerificationStatus({chainId: network.chain.id, CID: searchValueDebounced});

  // save if we're loading data
  const isLoading = useMemo(() => {
    return cidFromHash.loading || hashFromCid.loading || verificationStatus.loading
  }, [cidFromHash.loading, hashFromCid.loading, verificationStatus.loading]);

  // store the results
  useEffect(() => {
    if (verificationStatus.completed && hashFromCid.completed && cidFromHash.completed) {
      let cidList: FoundCid[] = [];
      if ( isHash ){
        cidList = cidFromHash.result.map(c => ({cid: c, hash: hashSanitized, status: 2}))
      } else if (verificationStatus.result > 0) {
        cidList = [{cid: searchValueDebounced, hash: hashFromCid.result, status: verificationStatus.result}]
      }
      setCidList(cidList);
    }
  }, [verificationStatus.completed, hashFromCid.completed, cidFromHash.completed]);

  // store the value the user has input
  const onChangeSearchBar = (input: string) => {
    setSearchValue(input);
  }

  return (
    <Container maxWidth="md" sx={{pt: "10vh"}}>

      <Box width="100%" display="flex" flexDirection={"column"} alignItems={"center"} >
        <div style={{width: 180, height: 80, backgroundColor: "#e8aeae", borderRadius: 8, marginBottom: 16, cursor: "pointer"}}
             onClick={() => navigate(RouteKey.Home)}
        />
        <SearchBar forcedValue={cidQueryString} onChange={onChangeSearchBar}/>
      </Box>

      <Box display="flex" flexDirection={"column"} mt={4}>
        {
          isLoading ?
            <Box display="flex" flexDirection={"column"} alignItems={"center"}>
              <CircularProgress/>
            </Box>
            :
            cidList.length === 0 ?
              <SearchNothingToShow searchValue={searchValueDebounced} isHash={isHash}/>
              :
              cidList.map(c => <Box mt={2}><SearchSingleCidResult key={c.cid} cid={c}/></Box>)
        }
      </Box>
    </Container>
  );

};

export interface ISearch {

}

export default Search;
