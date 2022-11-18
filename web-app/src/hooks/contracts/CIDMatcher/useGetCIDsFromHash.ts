import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {useEffect} from "react";
import {CONTRACTS_DETAILS} from "../../../utils/constants";

/**
 * @param {number} chainId - The chain id
 * @param {string} hash - The hash of the file you want to see if it's already stored or not
 */
export interface UseGetCIDsFromHashParams {
  chainId: number,
  hash: string
}

/**
 * Hook to load CIDs using the hash of the file
 */
export const useGetCIDsFromHash = (params: UseGetCIDsFromHashParams): useBaseAsyncHookState<string[]> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess, endAsyncActionError} = useBaseAsyncHook<string[]>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ABI,
    functionName: "getCIDsFromHash",
    args: [params.hash],
    onError: ((e) => endAsyncActionError(e.message))
  });

  // once data il loaded, return
  useEffect(() => {
    if (contractRead.data) {
      const CIDList = contractRead.data as string[];
      endAsyncActionSuccess(CIDList);
    }
  }, [contractRead.data]);

  // set as loading while data is fetching
  useEffect(() => {
    if (contractRead.isLoading) startAsyncAction();
  }, [contractRead.isLoading]);

  return { completed, error, loading, progress, result };
}
