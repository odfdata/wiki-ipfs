import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
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

  return { completed: contractRead.isSuccess, error, loading: contractRead.isFetching, progress, result: contractRead.data as string[] };
}
