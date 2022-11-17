import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
import {useEffect} from "react";

/**
 * @param {number} chainId - The chain id
 * @param {string} CID - The IPFS CID you want to get the hash for
 */
export interface UseGetHashFromCIDParams {
  chainId: number,
  CID: string
}

/**
 * Hook to get the hash from the IPFS CID
 */
export const useGetHashFromCID = (params: UseGetHashFromCIDParams): useBaseAsyncHookState<string> => {

  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<string>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ABI,
    functionName: "getHashFromCID"
  });

  // once data il loaded, return
  useEffect(() => {
    if (contractRead.data) {
      const hash = contractRead.data as string;
      endAsyncActionSuccess(hash);
    }
  }, [contractRead.data]);

  // set as loading while data is fetching
  useEffect(() => {
    if (contractRead.isLoading) startAsyncAction();
  }, [contractRead.isLoading]);

  return { completed, error, loading, progress, result };
};
