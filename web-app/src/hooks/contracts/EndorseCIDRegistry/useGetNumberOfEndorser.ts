import {useBaseAsyncHook} from "../../utils/useBaseAsyncHook";
import {useContractRead} from "wagmi";
import {CONTRACTS_DETAILS} from "../../../utils/constants";
import {BigNumber} from "@ethersproject/bignumber";
import {useBaseSmartContractReadReturn} from "../../utils/useBaseSmartContractRead";

/**
 * @param {number} chainId - The chain id
 * @param {string} CID - The CID for which you want to get the owner
 */
export interface UseGetOwnerOfCIDParams {
  chainId: number,
  CID: string
}

/**
 * Hook to get number of endorser for a given CID
 */
export const useGetNumberOfEndorser = (params: UseGetOwnerOfCIDParams): useBaseSmartContractReadReturn<number> => {
  const {completed, error, loading, result, progress,
    startAsyncAction, endAsyncActionSuccess} = useBaseAsyncHook<number>();
  const contractRead = useContractRead({
    address: CONTRACTS_DETAILS[params.chainId]?.ENDORSE_CID_REGISTRY_ADDRESS,
    abi: CONTRACTS_DETAILS[params.chainId]?.ENDORSE_CID_REGISTRY_ABI,
    functionName: "numberOfEndorser",
    args: [params.CID]
  });

  const readResult = contractRead.data as unknown as BigNumber;

  const refetch = () => {
    contractRead.refetch().then((result) => { })
  }

  return {
    completed: contractRead.isSuccess,
    error,
    loading: contractRead.isFetching,
    progress,
    result: readResult ? readResult.toNumber() : undefined,
    refetch
  };
};
