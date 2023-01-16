import {useBaseAsyncHook, useBaseAsyncHookState} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
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
 * Hook to get verification status of CID 2 Hash Oracle procedure
 */
export const useGetVerificationStatus = (params: UseGetVerificationStatusParams): useBaseAsyncHookState<number> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.CID_2_HASH_ORACLE_LOGIC_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.CID_2_HASH_ORACLE_LOGIC_ABI,
    functionName: "getVerificationStatus",
    args: [params.CID]
  });

  const readResult = contractRead.data ? (contractRead.data as unknown as BigNumber).toNumber() : 0;

  return { completed: contractRead.isSuccess, error, loading: contractRead.isFetching, progress, result: readResult };
};
