import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
import {useEffect} from "react";
import {BigNumber} from "@ethersproject/bignumber";

/**
 * @param {number} chainId - The chain id
 * @param {string} CID - The CID for which you want to get the index status
 */
export interface UseGetVerificationStatusParams {
  chainId: number,
  CID: string
}

/**
 * Hook to get index verification status
 */
export const useGetVerificationStatus = (params: UseGetVerificationStatusParams): useBaseAsyncHookState<number> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.CID_MATCHER_ABI,
    functionName: "getVerificationStatus",
    args: [params.CID]
  });

  return { completed: contractRead.isSuccess, error, loading: contractRead.isFetching, progress, result: (contractRead.data as BigNumber).toNumber() };
};
