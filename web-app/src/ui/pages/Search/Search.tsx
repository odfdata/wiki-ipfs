import React, {useEffect, useMemo, useState} from 'react';
import {Box, CircularProgress, Container} from "@mui/material";
import SearchBar from "../../atoms/SearchBar/SearchBar";
import {useNetwork} from "wagmi";
import {useNavigate, useSearchParams} from "react-router-dom";
import {RouteKey} from "../../../App.Routes";
import {useGetCIDsFromHash} from "../../../hooks/contracts/CIDMatcher/useGetCIDsFromHash";
import {useGetHashFromCID} from "../../../hooks/contracts/CIDMatcher/useGetHashFromCID";
import {useGetVerificationStatus} from "../../../hooks/contracts/CIDMatcher/useGetVerificationStatus";
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
  const [cidList, setCidList] = useState<FoundCid[]>([]);
  const network = useNetwork();
  const navigate = useNavigate();

  const cidQueryString = searchParams.get("cid");
  const isHash = useMemo(() =>
    new RegExp(/^(0x)?[A-Fa-f0-9]{64}$/).test(cidQueryString), [cidQueryString]);

  const hashSanitized = useMemo(() => cidQueryString.startsWith("0x") ? cidQueryString : "0x" + cidQueryString, [cidQueryString]);
  const cidFromHash = useGetCIDsFromHash({chainId: network.chain.id, hash: hashSanitized});
  const hashFromCid = useGetHashFromCID({chainId: network.chain.id, CID: cidQueryString});
  const verificationStatus = useGetVerificationStatus({chainId: network.chain.id, CID: cidQueryString});

  // save if we're loading data
  const isLoading = useMemo(() => {
    return cidFromHash.loading || hashFromCid.loading || verificationStatus.loading
  }, [cidFromHash.loading, hashFromCid.loading, verificationStatus.loading]);

  // store the results
  useEffect(() => {
    let cidList: FoundCid[] = [];
    if ( isHash ){
      cidList = cidFromHash.result.map(c => ({cid: c, hash: hashSanitized, status: 2}))
    } else if (verificationStatus.result > 0) {
      cidList = [{cid: cidQueryString, hash: hashFromCid.result, status: verificationStatus.result}]
    }
    setCidList(cidList);
  }, [verificationStatus.result, hashFromCid.result, cidFromHash.result]);

  const onEnterSearchPress = (input: string) => {
    setSearchParams({cid: input});
  }

  return (
    <Container maxWidth="md" sx={{pt: "10vh"}}>

      <Box width="100%" display="flex" flexDirection={"column"} alignItems={"center"} >
        <Box mb={2} sx={{cursor: "pointer"}} onClick={() => navigate(RouteKey.Home)}>
          <img src={"/img/logo.png"} width={180}/>
        </Box>
        <SearchBar initialValue={cidQueryString} onEnterPressed={onEnterSearchPress}/>
      </Box>

      <Box display="flex" flexDirection={"column"} mt={4}>
        {
          isLoading ?
            <Box display="flex" flexDirection={"column"} alignItems={"center"}>
              <CircularProgress/>
            </Box>
            :
            cidList.length === 0 ?
              <SearchNothingToShow searchValue={cidQueryString} isHash={isHash}/>
              :
              cidList.map((c, pos) => <Box mt={2} key={c.cid + pos}><SearchSingleCidResult cid={c}/></Box>)
        }
      </Box>
    </Container>
  );

};

export interface ISearch {

}

export default Search;
