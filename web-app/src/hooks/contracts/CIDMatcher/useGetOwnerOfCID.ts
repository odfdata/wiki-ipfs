import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";

/**
 * @param {number} chainId - The chain id
 * @param {string} CID - The CID for which you want to get the owner
 */
export interface UseGetOwnerOfCIDParams {
  chainId: number,
  CID: string
}

/**
 * Hook to get index verification status
 */
export const useGetOwnerOfCID = (params: UseGetOwnerOfCIDParams): useBaseAsyncHookState<string> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ABI,
    functionName: "getOwnerOfCID",
    args: [params.CID]
  });

  const readResult = contractRead.data as string;

  return { completed: contractRead.isSuccess, error, loading: contractRead.isFetching, progress, result: readResult };
};
